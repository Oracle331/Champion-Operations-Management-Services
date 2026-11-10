create table app_users (
  id uuid primary key,
  email varchar(320) not null unique,
  display_name varchar(255) not null,
  role varchar(32) not null,
  password_hash varchar(255) not null,
  enabled boolean not null,
  created_at timestamp with time zone not null,
  updated_at timestamp with time zone not null
);

create table transactions (
  id uuid primary key,
  code varchar(64) not null unique,
  address varchar(500) not null,
  jurisdiction varchar(8) not null,
  workflow_role varchar(32) not null,
  stage varchar(100) not null,
  client_name varchar(255) not null,
  contact_email varchar(320),
  contract_date date,
  closing_date date,
  built_year integer,
  price numeric(14, 2),
  tenant_occupied boolean not null,
  financing boolean not null,
  property_type varchar(80),
  photo_url text,
  virtual_tour_url text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  created_at timestamp with time zone not null,
  updated_at timestamp with time zone not null
);

create table transaction_parties (
  id uuid primary key,
  transaction_id uuid not null references transactions(id) on delete cascade,
  name varchar(255) not null,
  email varchar(320),
  party_type varchar(32) not null,
  status varchar(32) not null,
  created_at timestamp with time zone not null,
  updated_at timestamp with time zone not null
);

create table transaction_access (
  id uuid primary key,
  transaction_id uuid not null references transactions(id) on delete cascade,
  user_id uuid not null references app_users(id) on delete cascade,
  access_role varchar(32) not null,
  created_at timestamp with time zone not null,
  unique (transaction_id, user_id)
);

create table transaction_tasks (
  id uuid primary key,
  transaction_id uuid not null references transactions(id) on delete cascade,
  title varchar(500) not null,
  phase varchar(80) not null,
  owner_label varchar(120),
  due_date date,
  status varchar(32) not null,
  source_rule_id uuid,
  note text,
  created_at timestamp with time zone not null,
  updated_at timestamp with time zone not null
);

create table transaction_messages (
  id uuid primary key,
  transaction_id uuid not null references transactions(id) on delete cascade,
  author_user_id uuid references app_users(id) on delete set null,
  author_name varchar(255) not null,
  channel varchar(50) not null,
  visibility varchar(50) not null,
  subject varchar(500),
  body text not null,
  external_thread_id varchar(255),
  created_at timestamp with time zone not null
);

create table workflow_rules (
  id uuid primary key,
  jurisdiction varchar(8) not null,
  workflow_role varchar(32) not null,
  phase varchar(80) not null,
  title varchar(500) not null,
  owner_label varchar(120) not null,
  days_from_contract integer not null,
  priority varchar(32) not null,
  note text,
  source_label varchar(255),
  source_url text,
  version integer not null,
  active boolean not null,
  created_at timestamp with time zone not null,
  updated_at timestamp with time zone not null
);

create table integration_accounts (
  id uuid primary key,
  user_id uuid not null references app_users(id) on delete cascade,
  provider varchar(50) not null,
  provider_account_email varchar(320) not null,
  scopes text not null,
  encrypted_refresh_token text,
  access_token_expires_at timestamp with time zone,
  status varchar(50) not null,
  created_at timestamp with time zone not null,
  updated_at timestamp with time zone not null,
  unique (user_id, provider, provider_account_email)
);

create table outbound_emails (
  id uuid primary key,
  transaction_id uuid references transactions(id) on delete set null,
  created_by_user_id uuid not null references app_users(id) on delete restrict,
  to_recipients text not null,
  cc_recipients text,
  subject varchar(500) not null,
  body text not null,
  status varchar(32) not null,
  sent_at timestamp with time zone,
  provider_message_id varchar(255),
  last_error text,
  created_at timestamp with time zone not null,
  updated_at timestamp with time zone not null
);

create index idx_transactions_updated_at on transactions(updated_at desc);
create index idx_transaction_access_user_id on transaction_access(user_id);
create index idx_transaction_messages_transaction_created on transaction_messages(transaction_id, created_at desc);
create index idx_workflow_rules_scope on workflow_rules(jurisdiction, workflow_role, active);
create index idx_outbound_emails_created_at on outbound_emails(created_at desc);

insert into workflow_rules (
  id, jurisdiction, workflow_role, phase, title, owner_label, days_from_contract, priority,
  note, source_label, source_url, version, active, created_at, updated_at
) values
  ('00000000-0000-0000-0000-000000000101', 'MD', 'SELLER', 'Disclosure', 'Maryland disclosure or disclaimer delivery', 'Agent', 0, 'High',
   'Confirm delivery timing and rescission-window handling against the signed contract and current Maryland form requirements.',
   'Maryland Real Property Section 10-702', 'https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=grp&section=10-702&enactments=false', 1, true, now(), now()),
  ('00000000-0000-0000-0000-000000000102', 'DC', 'SELLER', 'Disclosure', 'D.C. seller disclosure review', 'Agent', 0, 'High',
   'Track delivery before or at execution and flag late-delivery termination windows.',
   'D.C. Code Section 42-1302', 'https://code.dccouncil.gov/us/dc/council/code/sections/42-1302', 1, true, now(), now()),
  ('00000000-0000-0000-0000-000000000103', 'VA', 'SELLER', 'Disclosure', 'Virginia residential disclosure notice', 'Agent', 0, 'High',
   'Confirm disclosure notice timing, delivery method, and any purchaser termination window.',
   'Virginia Code Section 55.1-709', 'https://law.lis.virginia.gov/vacode/title55.1/chapter7/section55.1-709/', 1, true, now(), now()),
  ('00000000-0000-0000-0000-000000000104', 'MD', 'SELLER', 'Disclosure', 'Lead-based paint package for pre-1978 housing', 'Agent', 0, 'High',
   'Attach pamphlet, known records, required warning language, and inspection-period tracking when the property is pre-1978.',
   'EPA Lead-Based Paint Disclosure Rule', 'https://www.epa.gov/lead/real-estate-disclosures-about-potential-lead-hazards', 1, true, now(), now()),
  ('00000000-0000-0000-0000-000000000105', 'DC', 'SELLER', 'Disclosure', 'Lead-based paint package for pre-1978 housing', 'Agent', 0, 'High',
   'Attach pamphlet, known records, required warning language, and inspection-period tracking when the property is pre-1978.',
   'EPA Lead-Based Paint Disclosure Rule', 'https://www.epa.gov/lead/real-estate-disclosures-about-potential-lead-hazards', 1, true, now(), now()),
  ('00000000-0000-0000-0000-000000000106', 'VA', 'SELLER', 'Disclosure', 'Lead-based paint package for pre-1978 housing', 'Agent', 0, 'High',
   'Attach pamphlet, known records, required warning language, and inspection-period tracking when the property is pre-1978.',
   'EPA Lead-Based Paint Disclosure Rule', 'https://www.epa.gov/lead/real-estate-disclosures-about-potential-lead-hazards', 1, true, now(), now());
