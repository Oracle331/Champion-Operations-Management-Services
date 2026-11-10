create table leads (
  id uuid primary key,
  name varchar(255) not null,
  email varchar(320),
  phone varchar(40),
  source varchar(120),
  lead_type varchar(32) not null,
  status varchar(32) not null,
  property_address varchar(500),
  jurisdiction varchar(8),
  notes text,
  created_by_user_id uuid references app_users(id) on delete set null,
  airtable_record_id varchar(100),
  airtable_sync_status varchar(32) not null,
  make_delivery_status varchar(32) not null,
  last_integration_error text,
  last_integrated_at timestamp with time zone,
  created_at timestamp with time zone not null,
  updated_at timestamp with time zone not null
);

create index idx_leads_created_at on leads(created_at desc);
create index idx_leads_status on leads(status);
create index idx_leads_email on leads(email);
