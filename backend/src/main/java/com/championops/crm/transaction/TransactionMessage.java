package com.championops.crm.transaction;

import com.championops.crm.user.AppUser;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "transaction_messages")
public class TransactionMessage {
  @Id
  @Column(nullable = false, updatable = false)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "transaction_id", nullable = false)
  private TransactionRecord transaction;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "author_user_id")
  private AppUser author;

  @Column(nullable = false)
  private String authorName;

  @Column(nullable = false)
  private String channel;

  @Column(nullable = false)
  private String visibility;

  private String subject;

  @Column(nullable = false, columnDefinition = "text")
  private String body;

  private String externalThreadId;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  protected TransactionMessage() {
  }

  public TransactionMessage(TransactionRecord transaction, AppUser author, String channel, String visibility, String subject, String body) {
    this.transaction = transaction;
    this.author = author;
    this.authorName = author.getDisplayName();
    this.channel = channel;
    this.visibility = visibility;
    this.subject = subject;
    this.body = body;
  }

  @PrePersist
  void prePersist() {
    if (id == null) id = UUID.randomUUID();
    createdAt = Instant.now();
  }

  public UUID getId() {
    return id;
  }

  public String getAuthorName() {
    return authorName;
  }

  public String getChannel() {
    return channel;
  }

  public String getVisibility() {
    return visibility;
  }

  public String getSubject() {
    return subject;
  }

  public String getBody() {
    return body;
  }

  public String getExternalThreadId() {
    return externalThreadId;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
