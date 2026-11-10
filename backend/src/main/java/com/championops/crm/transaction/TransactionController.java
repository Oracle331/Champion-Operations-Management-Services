package com.championops.crm.transaction;

import com.championops.crm.user.AppUser;
import com.championops.crm.user.AppUserRepository;
import com.championops.crm.user.Role;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
  private final TransactionRecordRepository transactions;
  private final TransactionAccessRepository access;
  private final TransactionPartyRepository parties;
  private final TransactionMessageRepository messages;
  private final AppUserRepository users;

  public TransactionController(
      TransactionRecordRepository transactions,
      TransactionAccessRepository access,
      TransactionPartyRepository parties,
      TransactionMessageRepository messages,
      AppUserRepository users) {
    this.transactions = transactions;
    this.access = access;
    this.parties = parties;
    this.messages = messages;
    this.users = users;
  }

  @GetMapping
  public List<TransactionSummary> list(@AuthenticationPrincipal UserDetails principal) {
    AppUser user = currentUser(principal);
    List<TransactionRecord> visible = isStaff(user)
        ? transactions.findAllByOrderByUpdatedAtDesc()
        : transactions.findVisibleForUser(user.getId());
    return visible.stream().map(TransactionSummary::from).toList();
  }

  @GetMapping("/{id}")
  public TransactionDetail get(@PathVariable UUID id, @AuthenticationPrincipal UserDetails principal) {
    AppUser user = currentUser(principal);
    TransactionRecord tx = requireVisible(id, user);
    return TransactionDetail.from(tx, messages.findByTransactionIdOrderByCreatedAtDesc(id));
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
  public TransactionDetail create(
      @Valid @RequestBody CreateTransactionRequest request,
      @AuthenticationPrincipal UserDetails principal) {
    AppUser user = currentUser(principal);
    TransactionRecord tx = new TransactionRecord();
    tx.setCode(nextCode(request.jurisdiction()));
    tx.setAddress(request.address());
    tx.setJurisdiction(request.jurisdiction());
    tx.setWorkflowRole(request.workflowRole());
    tx.setStage(request.stage());
    tx.setClientName(request.clientName());
    tx.setContactEmail(request.contactEmail());
    tx.setContractDate(request.contractDate());
    tx.setClosingDate(request.closingDate());
    tx.setBuiltYear(request.builtYear());
    tx.setPrice(request.price());
    tx.setTenantOccupied(Boolean.TRUE.equals(request.tenantOccupied()));
    tx.setFinancing(Boolean.TRUE.equals(request.financing()));
    tx.setPropertyType(request.propertyType());
    tx.setPhotoUrl(request.photoUrl());
    tx.setVirtualTourUrl(request.virtualTourUrl());
    tx.setLatitude(request.latitude());
    tx.setLongitude(request.longitude());
    TransactionRecord saved = transactions.save(tx);

    access.save(new TransactionAccess(saved, user, AccessRole.AGENT));
    if (request.contactEmail() != null && !request.contactEmail().isBlank()) {
      parties.save(new TransactionParty(saved, request.clientName(), request.contactEmail(), partyTypeFor(request.workflowRole()), PartyStatus.ACTIVE));
    }

    messages.save(new TransactionMessage(saved, user, "system", "team",
        "Transaction opened", "Transaction " + saved.getCode() + " was created for " + saved.getAddress() + "."));

    return TransactionDetail.from(requireVisible(saved.getId(), user), messages.findByTransactionIdOrderByCreatedAtDesc(saved.getId()));
  }

  @PostMapping("/{id}/comments")
  public MessageResponse comment(
      @PathVariable UUID id,
      @Valid @RequestBody CommentRequest request,
      @AuthenticationPrincipal UserDetails principal) {
    AppUser user = currentUser(principal);
    TransactionRecord tx = requireVisible(id, user);
    TransactionMessage message = messages.save(new TransactionMessage(
        tx,
        user,
        "comment",
        isStaff(user) ? "team" : "client",
        request.subject() == null || request.subject().isBlank() ? "Transaction comment" : request.subject(),
        request.body()));
    return MessageResponse.from(message);
  }

  @PostMapping("/{id}/access")
  @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
  public TransactionDetail grantAccess(
      @PathVariable UUID id,
      @Valid @RequestBody GrantAccessRequest request,
      @AuthenticationPrincipal UserDetails principal) {
    AppUser current = currentUser(principal);
    TransactionRecord tx = requireVisible(id, current);
    AppUser user = users.findByEmail(AppUser.normalizeEmail(request.email())).orElseThrow();
    if (!access.existsByTransactionIdAndUserId(id, user.getId())) {
      access.save(new TransactionAccess(tx, user, request.accessRole()));
      messages.save(new TransactionMessage(tx, current, "system", "team",
          "Access granted", user.getDisplayName() + " was added as " + request.accessRole() + "."));
    }
    return TransactionDetail.from(requireVisible(id, current), messages.findByTransactionIdOrderByCreatedAtDesc(id));
  }

  @PostMapping("/{id}/buyers")
  @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
  public TransactionDetail addBuyer(
      @PathVariable UUID id,
      @Valid @RequestBody AddBuyerRequest request,
      @AuthenticationPrincipal UserDetails principal) {
    AppUser current = currentUser(principal);
    TransactionRecord tx = requireVisible(id, current);
    parties.save(new TransactionParty(tx, request.name(), request.email(), PartyType.BUYER, request.status()));
    messages.save(new TransactionMessage(tx, current, "system", "team",
        "Buyer roster updated", request.name() + " was added as " + request.status() + "."));
    return TransactionDetail.from(requireVisible(id, current), messages.findByTransactionIdOrderByCreatedAtDesc(id));
  }

  @PatchMapping("/{id}/buyers/{partyId}")
  @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
  public TransactionDetail updateBuyerStatus(
      @PathVariable UUID id,
      @PathVariable UUID partyId,
      @Valid @RequestBody BuyerStatusRequest request,
      @AuthenticationPrincipal UserDetails principal) {
    AppUser current = currentUser(principal);
    TransactionRecord tx = requireVisible(id, current);
    TransactionParty party = parties.findByIdAndTransaction_IdAndPartyType(partyId, id, PartyType.BUYER)
        .orElseThrow(() -> new IllegalArgumentException("Buyer is not connected to this transaction."));
    party.setStatus(request.status());
    parties.save(party);
    messages.save(new TransactionMessage(tx, current, "system", "team",
        "Buyer status changed", party.getName() + " is now " + request.status() + "."));
    return TransactionDetail.from(requireVisible(id, current), messages.findByTransactionIdOrderByCreatedAtDesc(id));
  }

  private TransactionRecord requireVisible(UUID id, AppUser user) {
    TransactionRecord tx = transactions.findDetailedById(id).orElseThrow();
    if (isStaff(user) || access.existsByTransactionIdAndUserId(id, user.getId())) return tx;
    throw new IllegalArgumentException("Transaction is not available to this user.");
  }

  private AppUser currentUser(UserDetails principal) {
    return users.findByEmail(AppUser.normalizeEmail(principal.getUsername())).orElseThrow();
  }

  private boolean isStaff(AppUser user) {
    return user.getRole() == Role.ADMIN || user.getRole() == Role.AGENT;
  }

  private PartyType partyTypeFor(WorkflowRole workflowRole) {
    return workflowRole == WorkflowRole.BUYER ? PartyType.BUYER : PartyType.SELLER;
  }

  private String nextCode(Jurisdiction jurisdiction) {
    long count = transactions.countByJurisdiction(jurisdiction) + 1;
    return "TX-" + jurisdiction.name() + "-" + String.format("%03d", count);
  }

  public record CreateTransactionRequest(
      @NotBlank String address,
      @NotNull Jurisdiction jurisdiction,
      @NotNull WorkflowRole workflowRole,
      @NotBlank String stage,
      @NotBlank String clientName,
      @Email String contactEmail,
      LocalDate contractDate,
      LocalDate closingDate,
      Integer builtYear,
      BigDecimal price,
      Boolean tenantOccupied,
      Boolean financing,
      String propertyType,
      String photoUrl,
      String virtualTourUrl,
      BigDecimal latitude,
      BigDecimal longitude) {
  }

  public record CommentRequest(String subject, @NotBlank String body) {
  }

  public record GrantAccessRequest(@Email @NotBlank String email, @NotNull AccessRole accessRole) {
  }

  public record AddBuyerRequest(@NotBlank String name, @Email String email, @NotNull PartyStatus status) {
  }

  public record BuyerStatusRequest(@NotNull PartyStatus status) {
  }

  public record TransactionSummary(
      UUID id,
      String code,
      String address,
      Jurisdiction jurisdiction,
      WorkflowRole workflowRole,
      String stage,
      String clientName,
      LocalDate closingDate,
      BigDecimal price,
      String photoUrl,
      String guestToken) {
    static TransactionSummary from(TransactionRecord tx) {
      return new TransactionSummary(
          tx.getId(),
          tx.getCode(),
          tx.getAddress(),
          tx.getJurisdiction(),
          tx.getWorkflowRole(),
          tx.getStage(),
          tx.getClientName(),
          tx.getClosingDate(),
          tx.getPrice(),
          tx.getPhotoUrl(),
          tx.getGuestToken());
    }
  }

  public record TransactionDetail(TransactionSummary transaction, List<PartyResponse> parties, List<MessageResponse> messages) {
    static TransactionDetail from(TransactionRecord tx, List<TransactionMessage> messages) {
      return new TransactionDetail(
          TransactionSummary.from(tx),
          tx.getParties().stream().map(PartyResponse::from).toList(),
          messages.stream().map(MessageResponse::from).toList());
    }
  }

  public record PartyResponse(UUID id, String name, String email, PartyType partyType, PartyStatus status) {
    static PartyResponse from(TransactionParty party) {
      return new PartyResponse(party.getId(), party.getName(), party.getEmail(), party.getPartyType(), party.getStatus());
    }
  }

  public record MessageResponse(
      UUID id,
      String authorName,
      String channel,
      String visibility,
      String subject,
      String body,
      String externalThreadId,
      java.time.Instant createdAt) {
    static MessageResponse from(TransactionMessage message) {
      return new MessageResponse(
          message.getId(),
          message.getAuthorName(),
          message.getChannel(),
          message.getVisibility(),
          message.getSubject(),
          message.getBody(),
          message.getExternalThreadId(),
          message.getCreatedAt());
    }
  }
}
