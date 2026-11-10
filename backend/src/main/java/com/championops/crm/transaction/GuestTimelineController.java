package com.championops.crm.transaction;

import com.championops.crm.workflow.WorkflowRule;
import com.championops.crm.workflow.WorkflowRuleRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/guest/timeline")
public class GuestTimelineController {
  private final TransactionRecordRepository transactions;
  private final WorkflowRuleRepository workflowRules;

  public GuestTimelineController(TransactionRecordRepository transactions, WorkflowRuleRepository workflowRules) {
    this.transactions = transactions;
    this.workflowRules = workflowRules;
  }

  @GetMapping("/{token}")
  public GuestTimelineResponse timeline(@PathVariable String token) {
    TransactionRecord transaction = transactions.findByGuestToken(token).orElseThrow();
    List<WorkflowTaskResponse> tasks = workflowRules
        .findByActiveTrueAndJurisdictionAndWorkflowRoleOrderByDaysFromContractAsc(
            transaction.getJurisdiction(),
            transaction.getWorkflowRole())
        .stream()
        .map(rule -> WorkflowTaskResponse.from(rule, transaction.getContractDate()))
        .toList();
    return new GuestTimelineResponse(TransactionResponse.from(transaction), tasks);
  }

  public record GuestTimelineResponse(TransactionResponse transaction, List<WorkflowTaskResponse> tasks) {
  }

  public record TransactionResponse(
      UUID id,
      String code,
      String address,
      Jurisdiction jurisdiction,
      WorkflowRole workflowRole,
      String stage,
      String clientName,
      LocalDate contractDate,
      LocalDate closingDate,
      BigDecimal price,
      Integer builtYear,
      String propertyType,
      String photoUrl,
      String virtualTourUrl) {
    static TransactionResponse from(TransactionRecord transaction) {
      return new TransactionResponse(
          transaction.getId(),
          transaction.getCode(),
          transaction.getAddress(),
          transaction.getJurisdiction(),
          transaction.getWorkflowRole(),
          transaction.getStage(),
          transaction.getClientName(),
          transaction.getContractDate(),
          transaction.getClosingDate(),
          transaction.getPrice(),
          transaction.getBuiltYear(),
          transaction.getPropertyType(),
          transaction.getPhotoUrl(),
          transaction.getVirtualTourUrl());
    }
  }

  public record WorkflowTaskResponse(
      UUID id,
      String title,
      String phase,
      String owner,
      LocalDate dueDate,
      String status,
      String priority,
      String note,
      String sourceLabel,
      String sourceUrl) {
    static WorkflowTaskResponse from(WorkflowRule rule, LocalDate contractDate) {
      LocalDate baseDate = contractDate == null ? LocalDate.now() : contractDate;
      LocalDate dueDate = baseDate.plusDays(rule.getDaysFromContract());
      return new WorkflowTaskResponse(
          rule.getId(),
          rule.getTitle(),
          rule.getPhase(),
          rule.getOwnerLabel(),
          dueDate,
          dueDate.isBefore(LocalDate.now()) ? "active" : "todo",
          rule.getPriority(),
          rule.getNote(),
          rule.getSourceLabel(),
          rule.getSourceUrl());
    }
  }
}
