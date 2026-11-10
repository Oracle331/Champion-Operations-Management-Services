package com.championops.crm.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailDispatchService {
  private final JavaMailSender mailSender;
  private final OutboundEmailRepository outbox;
  private final String defaultFrom;

  public EmailDispatchService(
      JavaMailSender mailSender,
      OutboundEmailRepository outbox,
      @Value("${app.email.default-from:no-reply@championoperations.local}") String defaultFrom) {
    this.mailSender = mailSender;
    this.outbox = outbox;
    this.defaultFrom = defaultFrom;
  }

  public OutboundEmail send(OutboundEmail email) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
      helper.setFrom(defaultFrom);
      helper.setTo(splitRecipients(email.getToRecipients()));
      if (email.getCcRecipients() != null && !email.getCcRecipients().isBlank()) {
        helper.setCc(splitRecipients(email.getCcRecipients()));
      }
      helper.setSubject(email.getSubject());
      helper.setText(email.getBody(), false);
      mailSender.send(message);
      email.markSent(null);
    } catch (MessagingException | RuntimeException ex) {
      email.markFailed(ex.getMessage());
    }
    return outbox.save(email);
  }

  private String[] splitRecipients(String recipients) {
    return recipients.split("\\s*,\\s*");
  }
}
