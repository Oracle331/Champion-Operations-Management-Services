package com.championops.crm.email;

import com.championops.crm.transaction.TransactionRecord;
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
@Table(name = "outbound_emails")
public class OutboundEmail {
  @Id
  @Column(nullable = false, updatable = false)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "transaction_id")
  private TransactionRecord transaction;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "created_by_user_id", nullable = false)
  private AppUser createdBy;

  @Column(nullable = false, columnDefinition = "text")
  private String toRecipients;

  @Column(columnDefinition = "text")
  private String ccRecipients;

  @Column(nullable = false)
  private String subject;

  @Column(nullable = false, columnDefinition = "text")
  private String body;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private EmailStatus status = EmailStatus.QUEUED;

  private Instant sentAt;
  private String providerMessageId;

  @Column(columnDefinition = "text")
  private String lastError;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

  protected OutboundEmail() {
  }

  public OutboundEmail(TransactionRecord transaction, AppUser createdBy, String toRecipients, String ccRecipients, String subject, String body) {
    this.transaction = transaction;
    this.createdBy = createdBy;
    this.toRecipients = toRecipients;
    this.ccRecipients = ccRecipients;
    this.subject = subject;
    this.body = body;
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

  public AppUser getCreatedBy() {
    return createdBy;
  }

  public String getToRecipients() {
    return toRecipients;
  }

  public String getCcRecipients() {
    return ccRecipients;
  }

  public String getSubject() {
    return subject;
  }

  public String getBody() {
    return body;
  }

  public EmailStatus getStatus() {
    return status;
  }

  public void markSent(String providerMessageId) {
    this.status = EmailStatus.SENT;
    this.providerMessageId = providerMessageId;
    this.sentAt = Instant.now();
    this.lastError = null;
  }

  public void markFailed(String message) {
    this.status = EmailStatus.FAILED;
    this.lastError = message;
  }

  public Instant getSentAt() {
    return sentAt;
  }

  public String getProviderMessageId() {
    return providerMessageId;
  }

  public String getLastError() {
    return lastError;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
