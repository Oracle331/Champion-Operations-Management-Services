package com.championops.crm.lead;

import com.championops.crm.user.AppUser;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "leads")
public class Lead {
  @Id
  @Column(nullable = false, updatable = false)
  private UUID id;

  @Column(nullable = false)
  private String name;

  private String email;
  private String phone;
  private String source;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private LeadType leadType;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private LeadStatus status = LeadStatus.NEW;

  private String propertyAddress;
  private String jurisdiction;

  @Column(columnDefinition = "text")
  private String notes;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "created_by_user_id")
  private AppUser createdBy;

  private String airtableRecordId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private LeadIntegrationStatus airtableSyncStatus = LeadIntegrationStatus.NOT_CONFIGURED;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private LeadIntegrationStatus makeDeliveryStatus = LeadIntegrationStatus.NOT_CONFIGURED;

  @Column(columnDefinition = "text")
  private String lastIntegrationError;

  private Instant lastIntegratedAt;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

  protected Lead() {
  }

  public Lead(String name, String email, String phone, String source, LeadType leadType,
      String propertyAddress, String jurisdiction, String notes, AppUser createdBy) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.source = source;
    this.leadType = leadType;
    this.propertyAddress = propertyAddress;
    this.jurisdiction = jurisdiction;
    this.notes = notes;
    this.createdBy = createdBy;
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

  public UUID getId() { return id; }
  public String getName() { return name; }
  public String getEmail() { return email; }
  public String getPhone() { return phone; }
  public String getSource() { return source; }
  public LeadType getLeadType() { return leadType; }
  public LeadStatus getStatus() { return status; }
  public String getPropertyAddress() { return propertyAddress; }
  public String getJurisdiction() { return jurisdiction; }
  public String getNotes() { return notes; }
  public AppUser getCreatedBy() { return createdBy; }
  public String getAirtableRecordId() { return airtableRecordId; }
  public LeadIntegrationStatus getAirtableSyncStatus() { return airtableSyncStatus; }
  public LeadIntegrationStatus getMakeDeliveryStatus() { return makeDeliveryStatus; }
  public String getLastIntegrationError() { return lastIntegrationError; }
  public Instant getLastIntegratedAt() { return lastIntegratedAt; }
  public Instant getCreatedAt() { return createdAt; }
  public Instant getUpdatedAt() { return updatedAt; }

  public void setStatus(LeadStatus status) { this.status = status; }
  public void setAirtableRecordId(String airtableRecordId) { this.airtableRecordId = airtableRecordId; }
  public void setAirtableSyncStatus(LeadIntegrationStatus status) { this.airtableSyncStatus = status; }
  public void setMakeDeliveryStatus(LeadIntegrationStatus status) { this.makeDeliveryStatus = status; }
  public void setLastIntegrationError(String error) { this.lastIntegrationError = error; }
  public void setLastIntegratedAt(Instant timestamp) { this.lastIntegratedAt = timestamp; }
}
