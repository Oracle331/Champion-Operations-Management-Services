package com.championops.crm.lead;

import com.championops.crm.user.AppUser;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LeadService {
  private final LeadRepository leads;
  private final AirtableLeadClient airtable;
  private final MakeLeadWebhookClient make;

  public LeadService(LeadRepository leads, AirtableLeadClient airtable, MakeLeadWebhookClient make) {
    this.leads = leads;
    this.airtable = airtable;
    this.make = make;
  }

  @Transactional
  public Lead create(CreateLeadCommand command, AppUser createdBy) {
    Lead lead = leads.save(new Lead(
        command.name(), command.email(), command.phone(), command.source(), command.leadType(),
        command.propertyAddress(), command.jurisdiction(), command.notes(), createdBy));
    deliverIntegrations(lead);
    return leads.save(lead);
  }

  @Transactional
  public Lead retry(UUID id) {
    Lead lead = leads.findById(id).orElseThrow();
    deliverIntegrations(lead);
    return leads.save(lead);
  }

  private void deliverIntegrations(Lead lead) {
    LeadIntegrationResult airtableResult = airtable.sync(lead);
    LeadIntegrationResult makeResult = make.publish(lead);
    lead.setAirtableSyncStatus(airtableResult.status());
    lead.setMakeDeliveryStatus(makeResult.status());
    if (airtableResult.externalRecordId() != null) lead.setAirtableRecordId(airtableResult.externalRecordId());

    List<String> errors = new ArrayList<>();
    if (airtableResult.error() != null) errors.add(airtableResult.error());
    if (makeResult.error() != null) errors.add(makeResult.error());
    lead.setLastIntegrationError(errors.isEmpty() ? null : String.join(" ", errors));
    if (airtableResult.status() == LeadIntegrationStatus.SENT || makeResult.status() == LeadIntegrationStatus.SENT) {
      lead.setLastIntegratedAt(Instant.now());
    }
  }

  public record CreateLeadCommand(
      String name,
      String email,
      String phone,
      String source,
      LeadType leadType,
      String propertyAddress,
      String jurisdiction,
      String notes) {
  }
}
