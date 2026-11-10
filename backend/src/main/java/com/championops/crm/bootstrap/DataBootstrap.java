package com.championops.crm.bootstrap;

import com.championops.crm.user.AppUser;
import com.championops.crm.user.AppUserRepository;
import com.championops.crm.user.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataBootstrap implements ApplicationRunner {
  private final AppUserRepository users;
  private final PasswordEncoder passwordEncoder;
  private final String adminEmail;
  private final String adminPassword;
  private final String adminName;
  private final boolean resetAdminPassword;

  public DataBootstrap(
      AppUserRepository users,
      PasswordEncoder passwordEncoder,
      @Value("${app.bootstrap.admin-email:}") String adminEmail,
      @Value("${app.bootstrap.admin-password:}") String adminPassword,
      @Value("${app.bootstrap.admin-name:Champion Agent}") String adminName,
      @Value("${app.bootstrap.admin-reset-password:false}") boolean resetAdminPassword) {
    this.users = users;
    this.passwordEncoder = passwordEncoder;
    this.adminEmail = adminEmail;
    this.adminPassword = adminPassword;
    this.adminName = adminName;
    this.resetAdminPassword = resetAdminPassword;
  }

  @Override
  public void run(ApplicationArguments args) {
    if (adminEmail == null || adminEmail.isBlank()) return;
    if (adminPassword == null || adminPassword.length() < 12) {
      throw new IllegalStateException("Set APP_BOOTSTRAP_ADMIN_PASSWORD to at least 12 characters before first run.");
    }

    if (resetAdminPassword) {
      users.findByEmail(AppUser.normalizeEmail(adminEmail)).ifPresent(existing -> {
        existing.setPasswordHash(passwordEncoder.encode(adminPassword));
        users.save(existing);
      });
      return;
    }

    if (users.count() > 0) return;
    users.save(new AppUser(adminEmail, adminName, Role.ADMIN, passwordEncoder.encode(adminPassword)));
  }
}
