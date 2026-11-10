package com.championops.crm.transaction;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.security.SecureRandom;
import java.util.UUID;

@Entity
@Table(name = "transactions")
public class TransactionRecord {
  private static final SecureRandom SECURE_RANDOM = new SecureRandom();

  @Id
  @Column(nullable = false, updatable = false)
  private UUID id;

  @Column(nullable = false, unique = true)
  private String code;

  @Column(nullable = false)
  private String address;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Jurisdiction jurisdiction;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private WorkflowRole workflowRole;

  @Column(nullable = false)
  private String stage;

  @Column(nullable = false)
  private String clientName;

  private String contactEmail;
  private LocalDate contractDate;
  private LocalDate closingDate;
  private Integer builtYear;
  private BigDecimal price;
  private boolean tenantOccupied;
  private boolean financing;
  private String propertyType;
  private String photoUrl;
  private String virtualTourUrl;
  private String guestToken;
  private BigDecimal latitude;
  private BigDecimal longitude;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

  @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<TransactionParty> parties = new ArrayList<>();

  @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<TransactionAccess> accessGrants = new ArrayList<>();

  protected TransactionRecord() {
  }

  @PrePersist
  void prePersist() {
    if (id == null) id = UUID.randomUUID();
    if (guestToken == null || guestToken.isBlank()) guestToken = generateGuestToken();
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

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
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

  public String getStage() {
    return stage;
  }

  public void setStage(String stage) {
    this.stage = stage;
  }

  public String getClientName() {
    return clientName;
  }

  public void setClientName(String clientName) {
    this.clientName = clientName;
  }

  public String getContactEmail() {
    return contactEmail;
  }

  public void setContactEmail(String contactEmail) {
    this.contactEmail = contactEmail;
  }

  public LocalDate getContractDate() {
    return contractDate;
  }

  public void setContractDate(LocalDate contractDate) {
    this.contractDate = contractDate;
  }

  public LocalDate getClosingDate() {
    return closingDate;
  }

  public void setClosingDate(LocalDate closingDate) {
    this.closingDate = closingDate;
  }

  public Integer getBuiltYear() {
    return builtYear;
  }

  public void setBuiltYear(Integer builtYear) {
    this.builtYear = builtYear;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public void setPrice(BigDecimal price) {
    this.price = price;
  }

  public boolean isTenantOccupied() {
    return tenantOccupied;
  }

  public void setTenantOccupied(boolean tenantOccupied) {
    this.tenantOccupied = tenantOccupied;
  }

  public boolean isFinancing() {
    return financing;
  }

  public void setFinancing(boolean financing) {
    this.financing = financing;
  }

  public String getPropertyType() {
    return propertyType;
  }

  public void setPropertyType(String propertyType) {
    this.propertyType = propertyType;
  }

  public String getPhotoUrl() {
    return photoUrl;
  }

  public void setPhotoUrl(String photoUrl) {
    this.photoUrl = photoUrl;
  }

  public String getVirtualTourUrl() {
    return virtualTourUrl;
  }

  public void setVirtualTourUrl(String virtualTourUrl) {
    this.virtualTourUrl = virtualTourUrl;
  }

  public String getGuestToken() {
    return guestToken;
  }

  public void setGuestToken(String guestToken) {
    this.guestToken = guestToken;
  }

  public BigDecimal getLatitude() {
    return latitude;
  }

  public void setLatitude(BigDecimal latitude) {
    this.latitude = latitude;
  }

  public BigDecimal getLongitude() {
    return longitude;
  }

  public void setLongitude(BigDecimal longitude) {
    this.longitude = longitude;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }

  public List<TransactionParty> getParties() {
    return parties;
  }

  public List<TransactionAccess> getAccessGrants() {
    return accessGrants;
  }

  public static String generateGuestToken() {
    byte[] bytes = new byte[24];
    SECURE_RANDOM.nextBytes(bytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }
}
