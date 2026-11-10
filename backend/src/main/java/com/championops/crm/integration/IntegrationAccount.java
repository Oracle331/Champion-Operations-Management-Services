package com.championops.crm.integration;

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
@Table(name = "integration_accounts")
public class IntegrationAccount {
  @Id
  @Column(nullable = false, updatable = false)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private AppUser user;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private IntegrationProvider provider;

  @Column(nullable = false)
  private String providerAccountEmail;

  @Column(nullable = false, columnDefinition = "text")
  private String scopes;

  @Column(columnDefinition = "text")
  private String encryptedRefreshToken;

  private Instant accessTokenExpiresAt;

  @Column(nullable = false)
  private String status = "LINKED";

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

  protected IntegrationAccount() {
  }

  public IntegrationAccount(AppUser user, IntegrationProvider provider, String providerAccountEmail, String scopes) {
    this.user = user;
    this.provider = provider;
    this.providerAccountEmail = providerAccountEmail;
    this.scopes = scopes;
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

  public AppUser getUser() {
    return user;
  }

  public IntegrationProvider getProvider() {
    return provider;
  }

  public String getProviderAccountEmail() {
    return providerAccountEmail;
  }

  public void setProviderAccountEmail(String providerAccountEmail) {
    this.providerAccountEmail = providerAccountEmail;
  }

  public String getScopes() {
    return scopes;
  }

  public void setScopes(String scopes) {
    this.scopes = scopes;
  }

  public String getEncryptedRefreshToken() {
    return encryptedRefreshToken;
  }

  public void setEncryptedRefreshToken(String encryptedRefreshToken) {
    this.encryptedRefreshToken = encryptedRefreshToken;
  }

  public Instant getAccessTokenExpiresAt() {
    return accessTokenExpiresAt;
  }

  public void setAccessTokenExpiresAt(Instant accessTokenExpiresAt) {
    this.accessTokenExpiresAt = accessTokenExpiresAt;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }
}
