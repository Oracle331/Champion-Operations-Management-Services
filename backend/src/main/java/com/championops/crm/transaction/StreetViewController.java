package com.championops.crm.transaction;

import com.championops.crm.integration.GoogleIntegrationProperties;
import java.net.URI;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/properties")
@EnableConfigurationProperties(GoogleIntegrationProperties.class)
public class StreetViewController {
  private final GoogleIntegrationProperties google;
  private final RestClient restClient;

  public StreetViewController(GoogleIntegrationProperties google, RestClient.Builder restClientBuilder) {
    this.google = google;
    this.restClient = restClientBuilder.build();
  }

  @GetMapping("/street-view")
  public ResponseEntity<byte[]> streetView(
      @RequestParam String address,
      @RequestParam(defaultValue = "640") int width,
      @RequestParam(defaultValue = "360") int height) {
    if (google.getMapsApiKey() == null || google.getMapsApiKey().isBlank()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    int safeWidth = Math.max(240, Math.min(width, 640));
    int safeHeight = Math.max(180, Math.min(height, 640));
    URI uri = UriComponentsBuilder
        .fromUriString("https://maps.googleapis.com/maps/api/streetview")
        .queryParam("size", safeWidth + "x" + safeHeight)
        .queryParam("location", address)
        .queryParam("fov", 80)
        .queryParam("pitch", 0)
        .queryParam("source", "outdoor")
        .queryParam("key", google.getMapsApiKey())
        .build()
        .toUri();

    ResponseEntity<byte[]> image = restClient.get().uri(uri).retrieve().toEntity(byte[].class);
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(image.getHeaders().getContentType());
    headers.setCacheControl(CacheControl.noCache());
    return new ResponseEntity<>(image.getBody(), headers, image.getStatusCode());
  }
}
