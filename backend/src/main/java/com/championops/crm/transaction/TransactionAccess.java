package com.championops.crm.transaction;

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
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "transaction_access")
public class TransactionAccess {
  @Id
  @Column(nullable = false, updatable = false)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "transaction_id", nullable = false)
  private TransactionRecord transaction;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private AppUser user;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private AccessRole accessRole;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  protected TransactionAccess() {
  }

  public TransactionAccess(TransactionRecord transaction, AppUser user, AccessRole accessRole) {
    this.transaction = transaction;
    this.user = user;
    this.accessRole = accessRole;
  }

  @PrePersist
  void prePersist() {
    if (id == null) id = UUID.randomUUID();
    createdAt = Instant.now();
  }

  public UUID getId() {
    return id;
  }

  public TransactionRecord getTransaction() {
    return transaction;
  }

  public AppUser getUser() {
    return user;
  }

  public AccessRole getAccessRole() {
    return accessRole;
  }
}
