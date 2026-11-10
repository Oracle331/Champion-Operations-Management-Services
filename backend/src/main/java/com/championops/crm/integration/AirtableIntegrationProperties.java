package com.championops.crm.integration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.airtable")
public class AirtableIntegrationProperties {
  private String apiUrl = "https://api.airtable.com/v0";
  private String personalAccessToken;
  private String baseId;
  private String tableName = "Leads";

  public String getApiUrl() { return apiUrl; }
  public void setApiUrl(String apiUrl) { this.apiUrl = apiUrl; }
  public String getPersonalAccessToken() { return personalAccessToken; }
  public void setPersonalAccessToken(String personalAccessToken) { this.personalAccessToken = personalAccessToken; }
  public String getBaseId() { return baseId; }
  public void setBaseId(String baseId) { this.baseId = baseId; }
  public String getTableName() { return tableName; }
  public void setTableName(String tableName) { this.tableName = tableName; }

  public boolean isConfigured() {
    return hasText(personalAccessToken) && hasText(baseId) && hasText(tableName);
  }

  private boolean hasText(String value) {
    return value != null && !value.isBlank();
  }
}
