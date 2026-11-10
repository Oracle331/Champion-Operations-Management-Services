package com.championops.crm.integration;

import java.util.ArrayList;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.google")
public class GoogleIntegrationProperties {
  private String clientId;
  private String clientSecret;
  private String redirectUri;
  private String mapsApiKey;
  private List<String> scopes = new ArrayList<>();

  public String getClientId() {
    return clientId;
  }

  public void setClientId(String clientId) {
    this.clientId = clientId;
  }

  public String getClientSecret() {
    return clientSecret;
  }

  public void setClientSecret(String clientSecret) {
    this.clientSecret = clientSecret;
  }

  public String getRedirectUri() {
    return redirectUri;
  }

  public void setRedirectUri(String redirectUri) {
    this.redirectUri = redirectUri;
  }

  public String getMapsApiKey() {
    return mapsApiKey;
  }

  public void setMapsApiKey(String mapsApiKey) {
    this.mapsApiKey = mapsApiKey;
  }

  public List<String> getScopes() {
    return scopes;
  }

  public void setScopes(List<String> scopes) {
    this.scopes = scopes;
  }

  public boolean isConfigured() {
    return clientId != null && !clientId.isBlank() && clientSecret != null && !clientSecret.isBlank();
  }
}
