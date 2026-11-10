package com.championops.crm.transaction;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TransactionRecordRepository extends JpaRepository<TransactionRecord, UUID> {
  List<TransactionRecord> findAllByOrderByUpdatedAtDesc();

  @Query("""
      select distinct t
      from TransactionRecord t
      join t.accessGrants access
      where access.user.id = :userId
      order by t.updatedAt desc
      """)
  List<TransactionRecord> findVisibleForUser(@Param("userId") UUID userId);

  @EntityGraph(attributePaths = {"parties"})
  @Query("select t from TransactionRecord t where t.id = :id")
  Optional<TransactionRecord> findDetailedById(@Param("id") UUID id);

  @EntityGraph(attributePaths = {"parties"})
  Optional<TransactionRecord> findByGuestToken(String guestToken);

  long countByJurisdiction(Jurisdiction jurisdiction);
}
