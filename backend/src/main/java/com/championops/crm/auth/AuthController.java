package com.championops.crm.auth;

import com.championops.crm.user.AppUser;
import com.championops.crm.user.AppUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthenticationManager authenticationManager;
  private final AppUserRepository users;

  public AuthController(AuthenticationManager authenticationManager, AppUserRepository users) {
    this.authenticationManager = authenticationManager;
    this.users = users;
  }

  @GetMapping("/csrf")
  public Map<String, String> csrf(CsrfToken token) {
    return Map.of("headerName", token.getHeaderName(), "parameterName", token.getParameterName(), "token", token.getToken());
  }

  @PostMapping("/login")
  public UserSession login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(AppUser.normalizeEmail(request.email()), request.password()));

    SecurityContext context = SecurityContextHolder.createEmptyContext();
    context.setAuthentication(authentication);
    SecurityContextHolder.setContext(context);
    httpRequest.getSession(true).setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

    return toSession(authentication.getName());
  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
    if (request.getSession(false) != null) {
      request.getSession(false).invalidate();
    }
    SecurityContextHolder.clearContext();
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/session")
  public UserSession session(@AuthenticationPrincipal UserDetails principal) {
    return toSession(principal.getUsername());
  }

  @PostMapping("/account-requests")
  public Map<String, String> requestAccount(@Valid @RequestBody AccountRequest request) {
    return Map.of(
        "status", "received",
        "message", "Your account request was received. An administrator can provision the account from the Access area.");
  }

  @PostMapping("/password-reset/request")
  public Map<String, String> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
    return Map.of(
        "status", "received",
        "message", "If an account exists for that email, a reset workflow can be sent once email delivery is configured.");
  }

  private UserSession toSession(String email) {
    AppUser user = users.findByEmail(AppUser.normalizeEmail(email)).orElseThrow();
    return new UserSession(user.getId().toString(), user.getEmail(), user.getDisplayName(), user.getRole().name());
  }

  public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {
  }

  public record AccountRequest(@Email @NotBlank String email, @NotBlank String displayName, String requestedRole) {
  }

  public record PasswordResetRequest(@Email @NotBlank String email) {
  }

  public record UserSession(String id, String email, String displayName, String role) {
  }
}
