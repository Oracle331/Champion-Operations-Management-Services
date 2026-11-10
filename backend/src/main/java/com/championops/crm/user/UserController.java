package com.championops.crm.user;

import com.championops.crm.config.ProvisioningProperties;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
  private final AppUserRepository users;
  private final PasswordEncoder passwordEncoder;
  private final ProvisioningProperties provisioningProperties;

  public UserController(
      AppUserRepository users,
      PasswordEncoder passwordEncoder,
      ProvisioningProperties provisioningProperties) {
    this.users = users;
    this.passwordEncoder = passwordEncoder;
    this.provisioningProperties = provisioningProperties;
  }

  @GetMapping
  @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
  public List<UserResponse> listUsers() {
    return users.findAll().stream().map(UserResponse::from).toList();
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
  public UserResponse provisionUser(
      @Valid @RequestBody ProvisionUserRequest request,
      @AuthenticationPrincipal UserDetails principal) {
    AppUser creator = users.findByEmail(AppUser.normalizeEmail(principal.getUsername())).orElseThrow();
    if (!canProvision(creator.getRole(), request.role())) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN,
          creator.getRole() == Role.AGENT
              ? "Agents can provision buyer and seller accounts only."
              : "This account cannot provision users.");
    }
    String normalizedEmail = AppUser.normalizeEmail(request.email());
    if (users.existsByEmail(normalizedEmail)) {
      throw new IllegalArgumentException("A user already exists for " + normalizedEmail);
    }
    AppUser user = new AppUser(
        normalizedEmail,
        request.displayName(),
        request.role(),
        passwordEncoder.encode(request.temporaryPassword()));
    return UserResponse.from(users.save(user));
  }

  private boolean canProvision(Role creatorRole, Role targetRole) {
    if (creatorRole == Role.ADMIN) return true;
    if (creatorRole != Role.AGENT) return false;
    if (targetRole == Role.BUYER || targetRole == Role.SELLER) return true;
    return targetRole == Role.AGENT && provisioningProperties.isAllowAgentAgentProvisioning();
  }

  @PatchMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public UserResponse updateUser(@PathVariable UUID id, @Valid @RequestBody UpdateUserRequest request) {
    AppUser user = users.findById(id).orElseThrow();
    if (request.displayName() != null && !request.displayName().isBlank()) user.setDisplayName(request.displayName());
    if (request.role() != null) user.setRole(request.role());
    if (request.enabled() != null) user.setEnabled(request.enabled());
    if (request.temporaryPassword() != null && !request.temporaryPassword().isBlank()) {
      user.setPasswordHash(passwordEncoder.encode(request.temporaryPassword()));
    }
    return UserResponse.from(users.save(user));
  }

  public record ProvisionUserRequest(
      @Email @NotBlank String email,
      @NotBlank String displayName,
      @NotNull Role role,
      @NotBlank @Size(min = 12) String temporaryPassword) {
  }

  public record UpdateUserRequest(String displayName, Role role, Boolean enabled, @Size(min = 12) String temporaryPassword) {
  }

  public record UserResponse(UUID id, String email, String displayName, Role role, boolean enabled) {
    static UserResponse from(AppUser user) {
      return new UserResponse(user.getId(), user.getEmail(), user.getDisplayName(), user.getRole(), user.isEnabled());
    }
  }
}
