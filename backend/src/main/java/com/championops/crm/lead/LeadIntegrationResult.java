package com.championops.crm.lead;

public record LeadIntegrationResult(
    LeadIntegrationStatus status,
    String externalRecordId,
    String error) {
  public static LeadIntegrationResult notConfigured() {
    return new LeadIntegrationResult(LeadIntegrationStatus.NOT_CONFIGURED, null, null);
  }

  public static LeadIntegrationResult sent(String externalRecordId) {
    return new LeadIntegrationResult(LeadIntegrationStatus.SENT, externalRecordId, null);
  }

  public static LeadIntegrationResult failed(String error) {
    return new LeadIntegrationResult(LeadIntegrationStatus.FAILED, null, error);
  }
}
