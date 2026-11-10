package com.championops.crm.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.security")
public class ProvisioningProperties {
  /** Keep staff-account creation admin-only until the organization explicitly changes this setting. */
  private boolean allowAgentAgentProvisioning;

  public boolean isAllowAgentAgentProvisioning() {
    return allowAgentAgentProvisioning;
  }

  public void setAllowAgentAgentProvisioning(boolean allowAgentAgentProvisioning) {
    this.allowAgentAgentProvisioning = allowAgentAgentProvisioning;
  }
}
