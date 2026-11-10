package com.championops.crm.config;

import jakarta.validation.ConstraintViolationException;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
  @ExceptionHandler(AuthenticationException.class)
  ResponseEntity<Map<String, String>> authenticationFailure(AuthenticationException ex) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password."));
  }

  @ExceptionHandler({IllegalArgumentException.class, ConstraintViolationException.class, MethodArgumentNotValidException.class})
  ResponseEntity<Map<String, String>> badRequest(Exception ex) {
    return ResponseEntity.badRequest().body(Map.of("error", cleanMessage(ex)));
  }

  @ExceptionHandler(AccessDeniedException.class)
  ResponseEntity<Map<String, String>> accessDenied(AccessDeniedException ex) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied."));
  }

  @ExceptionHandler(IllegalStateException.class)
  ResponseEntity<Map<String, String>> conflict(IllegalStateException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", cleanMessage(ex)));
  }

  private String cleanMessage(Exception ex) {
    return ex.getMessage() == null || ex.getMessage().isBlank()
        ? "Request could not be processed."
        : ex.getMessage();
  }
}
