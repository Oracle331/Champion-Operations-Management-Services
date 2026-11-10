package com.championops.crm.lead;

import com.championops.crm.integration.MakeIntegrationProperties;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Component
public class MakeLeadWebhookClient {
  private final MakeIntegrationProperties properties;
  private final RestClient restClient;

  public MakeLeadWebhookClient(MakeIntegrationProperties properties, RestClient.Builder restClientBuilder) {
    this.properties = properties;
    this.restClient = restClientBuilder.build();
  }

  public LeadIntegrationResult publish(Lead lead) {
    if (!properties.isConfigured()) return LeadIntegrationResult.notConfigured();

    try {
      var request = restClient.post()
          .uri(properties.getNewLeadWebhookUrl())
          .contentType(MediaType.APPLICATION_JSON);
      if (properties.getWebhookApiKey() != null && !properties.getWebhookApiKey().isBlank()) {
        request.header("x-make-apikey", properties.getWebhookApiKey());
      }
      request.body(payloadFor(lead)).retrieve().toBodilessEntity();
      return LeadIntegrationResult.sent(null);
    } catch (RestClientResponseException ex) {
      return LeadIntegrationResult.failed("Make.com returned HTTP " + ex.getStatusCode().value() + ".");
    } catch (RuntimeException ex) {
      return LeadIntegrationResult.failed("Make.com request failed: " + safeMessage(ex));
    }
  }

  private Map<String, Object> payloadFor(Lead lead) {
    Map<String, Object> contact = new LinkedHashMap<>();
    contact.put("name", lead.getName());
    contact.put("email", lead.getEmail());
    contact.put("phone", lead.getPhone());
    contact.put("leadType", lead.getLeadType().name());
    contact.put("status", lead.getStatus().name());
    contact.put("source", lead.getSource());
    contact.put("propertyAddress", lead.getPropertyAddress());
    contact.put("jurisdiction", lead.getJurisdiction());
    contact.put("notes", lead.getNotes());

    Map<String, Object> payload = new LinkedHashMap<>();
    payload.put("eventType", "lead.created");
    payload.put("eventId", lead.getId().toString());
    payload.put("occurredAt", Instant.now().toString());
    List<String> channels = new ArrayList<>();
    if (lead.getEmail() != null && !lead.getEmail().isBlank()) channels.add("email");
    if (lead.getPhone() != null && !lead.getPhone().isBlank()) channels.add("sms");
    payload.put("channels", channels);
    payload.put("lead", contact);
    return payload;
  }

  private String safeMessage(RuntimeException ex) {
    return ex.getMessage() == null || ex.getMessage().isBlank() ? ex.getClass().getSimpleName() : ex.getMessage();
  }
}
