package com.championops.crm.lead;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeadRepository extends JpaRepository<Lead, UUID> {
  @EntityGraph(attributePaths = {"createdBy"})
  List<Lead> findTop100ByOrderByCreatedAtDesc();
}
