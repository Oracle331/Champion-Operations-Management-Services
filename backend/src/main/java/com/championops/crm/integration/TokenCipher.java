package com.championops.crm.integration;

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TokenCipher {
  private static final int IV_BYTES = 12;
  private static final int TAG_BITS = 128;

  private final SecureRandom secureRandom = new SecureRandom();
  private final byte[] key;

  public TokenCipher(@Value("${app.security.token-key-base64:}") String tokenKeyBase64) {
    this.key = tokenKeyBase64 == null || tokenKeyBase64.isBlank()
        ? new byte[0]
        : Base64.getDecoder().decode(tokenKeyBase64);
    if (key.length != 0 && key.length != 32) {
      throw new IllegalStateException("APP_TOKEN_ENCRYPTION_KEY_BASE64 must decode to 32 bytes.");
    }
  }

  public String encrypt(String plaintext) {
    if (plaintext == null || plaintext.isBlank()) return null;
    if (key.length == 0) {
      throw new IllegalStateException("Set APP_TOKEN_ENCRYPTION_KEY_BASE64 before linking Google accounts.");
    }
    try {
      byte[] iv = new byte[IV_BYTES];
      secureRandom.nextBytes(iv);
      Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
      cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(key, "AES"), new GCMParameterSpec(TAG_BITS, iv));
      byte[] encrypted = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));
      return "v1:" + Base64.getEncoder().encodeToString(iv) + ":" + Base64.getEncoder().encodeToString(encrypted);
    } catch (GeneralSecurityException ex) {
      throw new IllegalStateException("Could not encrypt integration token.", ex);
    }
  }
}
