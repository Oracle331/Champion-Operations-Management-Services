package com.championops.crm.integration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.make")
public class MakeIntegrationProperties {
  private String newLeadWebhookUrl;
  private String webhookApiKey;

  public String getNewLeadWebhookUrl() { return newLeadWebhookUrl; }
  public void setNewLeadWebhookUrl(String newLeadWebhookUrl) { this.newLeadWebhookUrl = newLeadWebhookUrl; }
  public String getWebhookApiKey() { return webhookApiKey; }
  public void setWebhookApiKey(String webhookApiKey) { this.webhookApiKey = webhookApiKey; }

  public boolean isConfigured() {
    return newLeadWebhookUrl != null && !newLeadWebhookUrl.isBlank();
  }
}
