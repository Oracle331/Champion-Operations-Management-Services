package com.championops.crm.integration;

import com.championops.crm.user.AppUser;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IntegrationAccountRepository extends JpaRepository<IntegrationAccount, UUID> {
  List<IntegrationAccount> findByUserOrderByUpdatedAtDesc(AppUser user);
  Optional<IntegrationAccount> findByUserAndProviderAndProviderAccountEmail(
      AppUser user,
      IntegrationProvider provider,
      String providerAccountEmail);
}
