package com.championops.crm.email;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OutboundEmailRepository extends JpaRepository<OutboundEmail, UUID> {
  @EntityGraph(attributePaths = {"transaction", "createdBy"})
  List<OutboundEmail> findTop50ByOrderByCreatedAtDesc();

  @EntityGraph(attributePaths = {"transaction", "createdBy"})
  @Query("select email from OutboundEmail email where email.id = :id")
  Optional<OutboundEmail> findDetailedById(@Param("id") UUID id);
}
