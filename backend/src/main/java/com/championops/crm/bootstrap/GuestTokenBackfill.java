package com.championops.crm.bootstrap;

import com.championops.crm.transaction.TransactionRecord;
import com.championops.crm.transaction.TransactionRecordRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class GuestTokenBackfill implements ApplicationRunner {
  private final TransactionRecordRepository transactions;

  public GuestTokenBackfill(TransactionRecordRepository transactions) {
    this.transactions = transactions;
  }

  @Override
  public void run(ApplicationArguments args) {
    transactions.findAll().stream()
        .filter(transaction -> transaction.getGuestToken() == null || transaction.getGuestToken().isBlank())
        .forEach(transaction -> {
          transaction.setGuestToken(TransactionRecord.generateGuestToken());
          transactions.save(transaction);
        });
  }
}
