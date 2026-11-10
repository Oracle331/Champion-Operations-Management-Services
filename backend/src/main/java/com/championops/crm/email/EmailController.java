package com.championops.crm.email;

import com.championops.crm.transaction.TransactionRecord;
import com.championops.crm.transaction.TransactionRecordRepository;
import com.championops.crm.user.AppUser;
import com.championops.crm.user.AppUserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email/outbox")
@PreAuthorize("hasAnyRole('ADMIN','AGENT')")
public class EmailController {
  private final OutboundEmailRepository outbox;
  private final TransactionRecordRepository transactions;
  private final AppUserRepository users;
  private final EmailDispatchService dispatchService;

  public EmailController(
      OutboundEmailRepository outbox,
      TransactionRecordRepository transactions,
      AppUserRepository users,
      EmailDispatchService dispatchService) {
    this.outbox = outbox;
    this.transactions = transactions;
    this.users = users;
    this.dispatchService = dispatchService;
  }

  @GetMapping
  public List<OutboundEmailResponse> list() {
    return outbox.findTop50ByOrderByCreatedAtDesc().stream().map(OutboundEmailResponse::from).toList();
  }

  @PostMapping
  public OutboundEmailResponse queue(@Valid @RequestBody QueueEmailRequest request, @AuthenticationPrincipal UserDetails principal) {
    TransactionRecord tx = request.transactionId() == null ? null : transactions.findById(request.transactionId()).orElseThrow();
    AppUser createdBy = users.findByEmail(AppUser.normalizeEmail(principal.getUsername())).orElseThrow();
    OutboundEmail email = new OutboundEmail(tx, createdBy, request.toRecipients(), request.ccRecipients(), request.subject(), request.body());
    return OutboundEmailResponse.from(outbox.save(email));
  }

  @PostMapping("/{id}/send")
  public OutboundEmailResponse send(@PathVariable UUID id) {
    return OutboundEmailResponse.from(dispatchService.send(outbox.findDetailedById(id).orElseThrow()));
  }

  public record QueueEmailRequest(
      UUID transactionId,
      @NotBlank String toRecipients,
      String ccRecipients,
      @NotBlank String subject,
      @NotBlank String body) {
  }

  public record OutboundEmailResponse(
      UUID id,
      UUID transactionId,
      String transactionCode,
      String createdBy,
      String toRecipients,
      String ccRecipients,
      String subject,
      EmailStatus status,
      Instant sentAt,
      String providerMessageId,
      String lastError,
      Instant createdAt) {
    static OutboundEmailResponse from(OutboundEmail email) {
      TransactionRecord tx = email.getTransaction();
      return new OutboundEmailResponse(
          email.getId(),
          tx == null ? null : tx.getId(),
          tx == null ? null : tx.getCode(),
          email.getCreatedBy().getDisplayName(),
          email.getToRecipients(),
          email.getCcRecipients(),
          email.getSubject(),
          email.getStatus(),
          email.getSentAt(),
          email.getProviderMessageId(),
          email.getLastError(),
          email.getCreatedAt());
    }
  }
}
