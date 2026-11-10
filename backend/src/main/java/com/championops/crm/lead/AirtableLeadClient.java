package com.championops.crm.lead;

import com.championops.crm.integration.AirtableIntegrationProperties;
import java.net.URI;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class AirtableLeadClient {
  private final AirtableIntegrationProperties properties;
  private final RestClient restClient;

  public AirtableLeadClient(AirtableIntegrationProperties properties, RestClient.Builder restClientBuilder) {
    this.properties = properties;
    this.restClient = restClientBuilder.build();
  }

  public LeadIntegrationResult sync(Lead lead) {
    if (!properties.isConfigured()) return LeadIntegrationResult.notConfigured();

    try {
      Map<String, Object> payload = Map.of("fields", fieldsFor(lead), "typecast", true);
      URI uri = recordUri(lead.getAirtableRecordId());
      AirtableRecordResponse response;
      if (lead.getAirtableRecordId() == null || lead.getAirtableRecordId().isBlank()) {
        response = restClient.post()
            .uri(uri)
            .headers(headers -> headers.setBearerAuth(properties.getPersonalAccessToken()))
            .contentType(MediaType.APPLICATION_JSON)
            .body(payload)
            .retrieve()
            .body(AirtableRecordResponse.class);
      } else {
        response = restClient.method(HttpMethod.PATCH)
            .uri(uri)
            .headers(headers -> headers.setBearerAuth(properties.getPersonalAccessToken()))
            .contentType(MediaType.APPLICATION_JSON)
            .body(payload)
            .retrieve()
            .body(AirtableRecordResponse.class);
      }
      if (response == null || response.id() == null || response.id().isBlank()) {
        return LeadIntegrationResult.failed("Airtable returned no record ID.");
      }
      return LeadIntegrationResult.sent(response.id());
    } catch (RestClientResponseException ex) {
      return LeadIntegrationResult.failed("Airtable returned HTTP " + ex.getStatusCode().value() + ".");
    } catch (RuntimeException ex) {
      return LeadIntegrationResult.failed("Airtable request failed: " + safeMessage(ex));
    }
  }

  private URI recordUri(String recordId) {
    UriComponentsBuilder builder = UriComponentsBuilder
        .fromUriString(properties.getApiUrl())
        .pathSegment(properties.getBaseId(), properties.getTableName());
    if (recordId != null && !recordId.isBlank()) builder.pathSegment(recordId);
    return builder.build().encode().toUri();
  }

  private Map<String, Object> fieldsFor(Lead lead) {
    Map<String, Object> fields = new LinkedHashMap<>();
    put(fields, "Name", lead.getName());
    put(fields, "Email", lead.getEmail());
    put(fields, "Phone", lead.getPhone());
    put(fields, "Lead Type", lead.getLeadType());
    put(fields, "Status", lead.getStatus());
    put(fields, "Source", lead.getSource());
    put(fields, "Property Address", lead.getPropertyAddress());
    put(fields, "Jurisdiction", lead.getJurisdiction());
    put(fields, "Notes", lead.getNotes());
    put(fields, "CRM Lead ID", lead.getId());
    put(fields, "Created At", lead.getCreatedAt());
    return fields;
  }

  private void put(Map<String, Object> fields, String key, Object value) {
    if (value == null) return;
    if (value instanceof Enum<?> enumValue) {
      fields.put(key, enumValue.name());
    } else if (value instanceof Instant instant) {
      fields.put(key, instant.toString());
    } else if (value instanceof String stringValue && stringValue.isBlank()) {
      return;
    } else {
      fields.put(key, value);
    }
  }

  private String safeMessage(RuntimeException ex) {
    return ex.getMessage() == null || ex.getMessage().isBlank() ? ex.getClass().getSimpleName() : ex.getMessage();
  }

  public record AirtableRecordResponse(String id) {
  }
}
