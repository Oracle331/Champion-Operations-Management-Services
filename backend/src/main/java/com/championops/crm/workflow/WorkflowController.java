package com.championops.crm.workflow;

import com.championops.crm.transaction.Jurisdiction;
import com.championops.crm.transaction.WorkflowRole;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/workflow-rules")
public class WorkflowController {
  private final WorkflowRuleRepository rules;

  public WorkflowController(WorkflowRuleRepository rules) {
    this.rules = rules;
  }

  @GetMapping
  public List<WorkflowRuleResponse> list(
      @RequestParam(required = false) Jurisdiction jurisdiction,
      @RequestParam(required = false) WorkflowRole workflowRole) {
    List<WorkflowRule> result = jurisdiction != null && workflowRole != null
        ? rules.findByActiveTrueAndJurisdictionAndWorkflowRoleOrderByDaysFromContractAsc(jurisdiction, workflowRole)
        : rules.findByActiveTrueOrderByJurisdictionAscWorkflowRoleAscPhaseAscDaysFromContractAsc();
    return result.stream().map(WorkflowRuleResponse::from).toList();
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
  public WorkflowRuleResponse create(@Valid @RequestBody UpsertWorkflowRuleRequest request) {
    WorkflowRule rule = new WorkflowRule();
    apply(rule, request);
    return WorkflowRuleResponse.from(rules.save(rule));
  }

  @PatchMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
  public WorkflowRuleResponse update(@PathVariable UUID id, @Valid @RequestBody UpsertWorkflowRuleRequest request) {
    WorkflowRule rule = rules.findById(id).orElseThrow();
    apply(rule, request);
    rule.setVersion(rule.getVersion() + 1);
    return WorkflowRuleResponse.from(rules.save(rule));
  }

  @PatchMapping("/{id}/archive")
  @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
  public WorkflowRuleResponse archive(@PathVariable UUID id) {
    WorkflowRule rule = rules.findById(id).orElseThrow();
    rule.setActive(false);
    rule.setVersion(rule.getVersion() + 1);
    return WorkflowRuleResponse.from(rules.save(rule));
  }

  @GetMapping("/audit")
  @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
  public WorkflowAuditResponse audit() {
    List<WorkflowRule> active = rules.findByActiveTrueOrderByJurisdictionAscWorkflowRoleAscPhaseAscDaysFromContractAsc();
    List<String> missingSource = active.stream()
        .filter(rule -> rule.getSourceUrl() == null || rule.getSourceUrl().isBlank())
        .map(rule -> rule.getJurisdiction() + " " + rule.getWorkflowRole() + ": " + rule.getTitle())
        .toList();
    List<String> missingCoverage = List.of(
        "County/city requirements are not yet represented as separate rule scopes.",
        "Brokerage policy, title-company requirements, and lender-specific milestones should be added as source-backed rules.",
        "Legal-source rechecks should run on a recurring calendar and create review tasks when a source changes.");
    return new WorkflowAuditResponse(active.size(), missingSource, missingCoverage);
  }

  private void apply(WorkflowRule rule, UpsertWorkflowRuleRequest request) {
    rule.setJurisdiction(request.jurisdiction());
    rule.setWorkflowRole(request.workflowRole());
    rule.setPhase(request.phase());
    rule.setTitle(request.title());
    rule.setOwnerLabel(request.ownerLabel());
    rule.setDaysFromContract(request.daysFromContract());
    rule.setPriority(request.priority());
    rule.setNote(request.note());
    rule.setSourceLabel(request.sourceLabel());
    rule.setSourceUrl(request.sourceUrl());
  }

  public record UpsertWorkflowRuleRequest(
      @NotNull Jurisdiction jurisdiction,
      @NotNull WorkflowRole workflowRole,
      @NotBlank String phase,
      @NotBlank String title,
      @NotBlank String ownerLabel,
      int daysFromContract,
      @NotBlank String priority,
      String note,
      String sourceLabel,
      String sourceUrl) {
  }

  public record WorkflowRuleResponse(
      UUID id,
      Jurisdiction jurisdiction,
      WorkflowRole workflowRole,
      String phase,
      String title,
      String ownerLabel,
      int daysFromContract,
      String priority,
      String note,
      String sourceLabel,
      String sourceUrl,
      int version,
      boolean active) {
    static WorkflowRuleResponse from(WorkflowRule rule) {
      return new WorkflowRuleResponse(
          rule.getId(),
          rule.getJurisdiction(),
          rule.getWorkflowRole(),
          rule.getPhase(),
          rule.getTitle(),
          rule.getOwnerLabel(),
          rule.getDaysFromContract(),
          rule.getPriority(),
          rule.getNote(),
          rule.getSourceLabel(),
          rule.getSourceUrl(),
          rule.getVersion(),
          rule.isActive());
    }
  }

  public record WorkflowAuditResponse(int activeRuleCount, List<String> rulesMissingSource, List<String> coverageNotes) {
  }
}
