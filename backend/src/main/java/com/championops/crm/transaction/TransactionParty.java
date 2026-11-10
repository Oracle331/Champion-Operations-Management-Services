package com.championops.crm.transaction;

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
@Table(name = "transaction_parties")
public class TransactionParty {
  @Id
  @Column(nullable = false, updatable = false)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "transaction_id", nullable = false)
  private TransactionRecord transaction;

  @Column(nullable = false)
  private String name;

  private String email;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PartyType partyType;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PartyStatus status = PartyStatus.ACTIVE;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

  protected TransactionParty() {
  }

  public TransactionParty(TransactionRecord transaction, String name, String email, PartyType partyType, PartyStatus status) {
    this.transaction = transaction;
    this.name = name;
    this.email = email;
    this.partyType = partyType;
    this.status = status == null ? PartyStatus.ACTIVE : status;
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

  public TransactionRecord getTransaction() {
    return transaction;
  }

  public void setTransaction(TransactionRecord transaction) {
    this.transaction = transaction;
  }

  public String getName() {
    return name;
  }

  public String getEmail() {
    return email;
  }

  public PartyType getPartyType() {
    return partyType;
  }

  public PartyStatus getStatus() {
    return status;
  }

  public void setStatus(PartyStatus status) {
    this.status = status;
  }
}
