package com.championops.crm.workflow;

import com.championops.crm.transaction.Jurisdiction;
import com.championops.crm.transaction.WorkflowRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "workflow_rules")
public class WorkflowRule {
  @Id
  @Column(nullable = false, updatable = false)
  private UUID id;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Jurisdiction jurisdiction;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private WorkflowRole workflowRole;

  @Column(nullable = false)
  private String phase;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  private String ownerLabel;

  @Column(nullable = false)
  private int daysFromContract;

  @Column(nullable = false)
  private String priority;

  @Column(columnDefinition = "text")
  private String note;

  private String sourceLabel;
  private String sourceUrl;

  @Column(nullable = false)
  private int version = 1;

  @Column(nullable = false)
  private boolean active = true;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

  protected WorkflowRule() {
  }

  @PrePersist
  void prePersist() {
    if (id == null) id = UUID.randomUUID();
    Instant now = Instant.now();
    createdAt = now;
    updatedAt = now;
  }

  @PreUpdate
  void preUpdate() {
    updatedAt = Instant.now();
  }

  public UUID getId() {
    return id;
  }

  public Jurisdiction getJurisdiction() {
    return jurisdiction;
  }

  public void setJurisdiction(Jurisdiction jurisdiction) {
    this.jurisdiction = jurisdiction;
  }

  public WorkflowRole getWorkflowRole() {
    return workflowRole;
  }

  public void setWorkflowRole(WorkflowRole workflowRole) {
    this.workflowRole = workflowRole;
  }

  public String getPhase() {
    return phase;
  }

  public void setPhase(String phase) {
    this.phase = phase;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getOwnerLabel() {
    return ownerLabel;
  }

  public void setOwnerLabel(String ownerLabel) {
    this.ownerLabel = ownerLabel;
  }

  public int getDaysFromContract() {
    return daysFromContract;
  }

  public void setDaysFromContract(int daysFromContract) {
    this.daysFromContract = daysFromContract;
  }

  public String getPriority() {
    return priority;
  }

  public void setPriority(String priority) {
    this.priority = priority;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }

  public String getSourceLabel() {
    return sourceLabel;
  }

  public void setSourceLabel(String sourceLabel) {
    this.sourceLabel = sourceLabel;
  }

  public String getSourceUrl() {
    return sourceUrl;
  }

  public void setSourceUrl(String sourceUrl) {
    this.sourceUrl = sourceUrl;
  }

  public int getVersion() {
    return version;
  }

  public void setVersion(int version) {
    this.version = version;
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }
}
