package com.championops.crm.transaction;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionPartyRepository extends JpaRepository<TransactionParty, UUID> {
  Optional<TransactionParty> findByIdAndTransaction_IdAndPartyType(UUID id, UUID transactionId, PartyType partyType);
}
