package com.championops.crm.transaction;

import com.championops.crm.user.AppUser;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionAccessRepository extends JpaRepository<TransactionAccess, UUID> {
  boolean existsByTransactionIdAndUserId(UUID transactionId, UUID userId);
  Optional<TransactionAccess> findByTransactionIdAndUser(UUID transactionId, AppUser user);
}
