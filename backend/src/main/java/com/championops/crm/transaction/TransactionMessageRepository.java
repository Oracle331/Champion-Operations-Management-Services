package com.championops.crm.transaction;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionMessageRepository extends JpaRepository<TransactionMessage, UUID> {
  List<TransactionMessage> findByTransactionIdOrderByCreatedAtDesc(UUID transactionId);
}
