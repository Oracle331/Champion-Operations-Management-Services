alter table transactions add column guest_token varchar(80);
create unique index idx_transactions_guest_token on transactions(guest_token);
