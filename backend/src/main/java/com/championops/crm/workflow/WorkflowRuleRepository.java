package com.championops.crm.workflow;

import com.championops.crm.transaction.Jurisdiction;
import com.championops.crm.transaction.WorkflowRole;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkflowRuleRepository extends JpaRepository<WorkflowRule, UUID> {
  List<WorkflowRule> findByActiveTrueOrderByJurisdictionAscWorkflowRoleAscPhaseAscDaysFromContractAsc();
  List<WorkflowRule> findByActiveTrueAndJurisdictionAndWorkflowRoleOrderByDaysFromContractAsc(
      Jurisdiction jurisdiction,
      WorkflowRole workflowRole);
}
