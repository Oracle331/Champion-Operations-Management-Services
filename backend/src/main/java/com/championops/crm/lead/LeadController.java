package com.championops.crm.lead;

import com.championops.crm.user.AppUser;
import com.championops.crm.user.AppUserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
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
@RequestMapping("/api/leads")
@PreAuthorize("hasAnyRole('ADMIN','AGENT')")
public class LeadController {
  private final LeadRepository leads;
  private final LeadService leadService;
  private final AppUserRepository users;

  public LeadController(LeadRepository leads, LeadService leadService, AppUserRepository users) {
    this.leads = leads;
    this.leadService = leadService;
    this.users = users;
  }

  @GetMapping
  public List<LeadResponse> list() {
    return leads.findTop100ByOrderByCreatedAtDesc().stream().map(LeadResponse::from).toList();
  }

  @GetMapping("/{id}")
  public LeadResponse get(@PathVariable UUID id) {
    return LeadResponse.from(leads.findById(id).orElseThrow());
  }

  @PostMapping
  public LeadResponse create(
      @Valid @RequestBody CreateLeadRequest request,
      @AuthenticationPrincipal UserDetails principal) {
    if (isBlank(request.email()) && isBlank(request.phone())) {
      throw new IllegalArgumentException("Provide an email address or phone number for the lead.");
    }
    AppUser createdBy = users.findByEmail(AppUser.normalizeEmail(principal.getUsername())).orElseThrow();
    Lead lead = leadService.create(new LeadService.CreateLeadCommand(
        request.name(), request.email(), request.phone(), request.source(), request.leadType(),
        request.propertyAddress(), request.jurisdiction(), request.notes()), createdBy);
    return LeadResponse.from(lead);
  }

  @PatchMapping("/{id}")
  public LeadResponse updateStatus(
      @PathVariable UUID id,
      @Valid @RequestBody UpdateLeadRequest request) {
    Lead lead = leads.findById(id).orElseThrow();
    lead.setStatus(request.status());
    return LeadResponse.from(leads.save(lead));
  }

  @PostMapping("/{id}/retry-integrations")
  public LeadResponse retryIntegrations(@PathVariable UUID id) {
    return LeadResponse.from(leadService.retry(id));
  }

  private boolean isBlank(String value) {
    return value == null || value.isBlank();
  }

  public record CreateLeadRequest(
      @NotBlank String name,
      @Email String email,
      String phone,
      String source,
      @NotNull LeadType leadType,
      String propertyAddress,
      String jurisdiction,
      String notes) {
  }

  public record UpdateLeadRequest(@NotNull LeadStatus status) {
  }

  public record LeadResponse(
      UUID id,
      String name,
      String email,
      String phone,
      String source,
      LeadType leadType,
      LeadStatus status,
      String propertyAddress,
      String jurisdiction,
      String notes,
      String createdBy,
      String airtableRecordId,
      LeadIntegrationStatus airtableSyncStatus,
      LeadIntegrationStatus makeDeliveryStatus,
      String lastIntegrationError,
      Instant lastIntegratedAt,
      Instant createdAt,
      Instant updatedAt) {
    static LeadResponse from(Lead lead) {
      return new LeadResponse(
          lead.getId(), lead.getName(), lead.getEmail(), lead.getPhone(), lead.getSource(),
          lead.getLeadType(), lead.getStatus(), lead.getPropertyAddress(), lead.getJurisdiction(),
          lead.getNotes(), lead.getCreatedBy() == null ? null : lead.getCreatedBy().getDisplayName(),
          lead.getAirtableRecordId(), lead.getAirtableSyncStatus(), lead.getMakeDeliveryStatus(),
          lead.getLastIntegrationError(), lead.getLastIntegratedAt(), lead.getCreatedAt(), lead.getUpdatedAt());
    }
  }
}
