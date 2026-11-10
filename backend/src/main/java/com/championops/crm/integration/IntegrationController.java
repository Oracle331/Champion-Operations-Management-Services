package com.championops.crm.integration;

import com.championops.crm.user.AppUser;
import com.championops.crm.user.AppUserRepository;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotBlank;
import java.net.URI;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/integrations")
@EnableConfigurationProperties({
    GoogleIntegrationProperties.class,
    AirtableIntegrationProperties.class,
    MakeIntegrationProperties.class})
public class IntegrationController {
  private static final String GOOGLE_STATE_SESSION_KEY = "GOOGLE_OAUTH_STATE";

  private final IntegrationAccountRepository accounts;
  private final AppUserRepository users;
  private final GoogleIntegrationProperties google;
  private final TokenCipher tokenCipher;
  private final RestClient restClient;

  public IntegrationController(
      IntegrationAccountRepository accounts,
      AppUserRepository users,
      GoogleIntegrationProperties google,
      TokenCipher tokenCipher,
      RestClient.Builder restClientBuilder) {
    this.accounts = accounts;
    this.users = users;
    this.google = google;
    this.tokenCipher = tokenCipher;
    this.restClient = restClientBuilder.build();
  }

  @GetMapping
  public List<IntegrationAccountResponse> list(@AuthenticationPrincipal UserDetails principal) {
    return accounts.findByUserOrderByUpdatedAtDesc(currentUser(principal)).stream()
        .map(IntegrationAccountResponse::from)
        .toList();
  }

  @GetMapping("/google/setup")
  public GoogleSetupResponse googleSetup() {
    return new GoogleSetupResponse(
        google.isConfigured(),
        google.getRedirectUri(),
        google.getScopes(),
        "Create a Google OAuth web client, add the redirect URI, then call /api/integrations/google/authorize while signed in.");
  }

  @GetMapping("/google/authorize")
  public Map<String, String> authorizeGoogle(HttpServletRequest request) {
    if (!google.isConfigured()) {
      throw new IllegalStateException("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET before linking Google accounts.");
    }
    String state = UUID.randomUUID().toString();
    request.getSession(true).setAttribute(GOOGLE_STATE_SESSION_KEY, state);

    String authorizationUrl = UriComponentsBuilder
        .fromUriString("https://accounts.google.com/o/oauth2/v2/auth")
        .queryParam("client_id", google.getClientId())
        .queryParam("redirect_uri", google.getRedirectUri())
        .queryParam("response_type", "code")
        .queryParam("scope", String.join(" ", google.getScopes()))
        .queryParam("access_type", "offline")
        .queryParam("include_granted_scopes", "true")
        .queryParam("prompt", "consent")
        .queryParam("state", state)
        .build()
        .toUriString();

    return Map.of("authorizationUrl", authorizationUrl);
  }

  @GetMapping("/google/callback")
  public Map<String, String> googleCallback(
      @RequestParam @NotBlank String code,
      @RequestParam @NotBlank String state,
      HttpServletRequest request,
      @AuthenticationPrincipal UserDetails principal) {
    Object expectedState = request.getSession(false) == null
        ? null
        : request.getSession(false).getAttribute(GOOGLE_STATE_SESSION_KEY);
    if (!state.equals(expectedState)) {
      throw new IllegalArgumentException("Google OAuth state did not match the current session.");
    }

    AppUser user = currentUser(principal);
    TokenResponse token = exchangeCode(code);
    GoogleUserInfo profile = fetchProfile(token.accessToken());
    String scopes = token.scope() == null || token.scope().isBlank()
        ? String.join(" ", google.getScopes())
        : token.scope();

    IntegrationAccount account = accounts
        .findByUserAndProviderAndProviderAccountEmail(user, IntegrationProvider.GOOGLE, profile.email())
        .orElseGet(() -> new IntegrationAccount(user, IntegrationProvider.GOOGLE, profile.email(), scopes));
    account.setProviderAccountEmail(profile.email());
    account.setScopes(scopes);
    if (token.refreshToken() != null && !token.refreshToken().isBlank()) {
      account.setEncryptedRefreshToken(tokenCipher.encrypt(token.refreshToken()));
    }
    if (token.expiresIn() != null) {
      account.setAccessTokenExpiresAt(Instant.now().plusSeconds(token.expiresIn()));
    }
    account.setStatus("LINKED");
    accounts.save(account);

    return Map.of("status", "linked", "provider", "GOOGLE", "email", profile.email());
  }

  @DeleteMapping("/{id}")
  public Map<String, String> unlink(@PathVariable UUID id, @AuthenticationPrincipal UserDetails principal) {
    AppUser user = currentUser(principal);
    IntegrationAccount account = accounts.findById(id).orElseThrow();
    if (!account.getUser().getId().equals(user.getId())) {
      throw new IllegalArgumentException("Integration account is not owned by the current user.");
    }
    account.setStatus("REVOKED");
    account.setEncryptedRefreshToken(null);
    accounts.save(account);
    return Map.of("status", "revoked");
  }

  private TokenResponse exchangeCode(String code) {
    MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
    body.add("client_id", google.getClientId());
    body.add("client_secret", google.getClientSecret());
    body.add("code", code);
    body.add("grant_type", "authorization_code");
    body.add("redirect_uri", google.getRedirectUri());

    return restClient.post()
        .uri(URI.create("https://oauth2.googleapis.com/token"))
        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
        .body(body)
        .retrieve()
        .body(TokenResponse.class);
  }

  private GoogleUserInfo fetchProfile(String accessToken) {
    return restClient.get()
        .uri(URI.create("https://openidconnect.googleapis.com/v1/userinfo"))
        .headers(headers -> headers.setBearerAuth(accessToken))
        .retrieve()
        .body(GoogleUserInfo.class);
  }

  private AppUser currentUser(UserDetails principal) {
    return users.findByEmail(AppUser.normalizeEmail(principal.getUsername())).orElseThrow();
  }

  public record GoogleSetupResponse(boolean configured, String redirectUri, List<String> scopes, String nextStep) {
  }

  public record IntegrationAccountResponse(UUID id, IntegrationProvider provider, String providerAccountEmail, String scopes, String status, Instant updatedAt) {
    static IntegrationAccountResponse from(IntegrationAccount account) {
      return new IntegrationAccountResponse(
          account.getId(),
          account.getProvider(),
          account.getProviderAccountEmail(),
          account.getScopes(),
          account.getStatus(),
          account.getUpdatedAt());
    }
  }

  public record TokenResponse(
      @JsonProperty("access_token") String accessToken,
      @JsonProperty("refresh_token") String refreshToken,
      @JsonProperty("expires_in") Long expiresIn,
      @JsonProperty("scope") String scope,
      @JsonProperty("token_type") String tokenType) {
  }

  public record GoogleUserInfo(@JsonProperty("email") String email, @JsonProperty("name") String name) {
  }
}
