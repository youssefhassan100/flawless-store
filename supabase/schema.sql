create extension if not exists "pgcrypto";

create table products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  sale_price numeric(10,2) check (sale_price >= 0),
  category text not null default 'Ready to wear',
  images text[] not null default '{}',
  is_bestseller boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table discount_codes (
  code text primary key,
  percent int not null check (percent between 1 and 90),
  active boolean not null default true
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  city text not null,
  address text not null,
  notes text,
  items jsonb not null,
  subtotal numeric(10,2) not null,
  discount numeric(10,2) not null default 0,
  discount_code text,
  total numeric(10,2) not null,
  payment_method text not null default 'COD',
  status text not null default 'pending' check (status in ('pending','shipped','delivered')),
  created_at timestamptz not null default now()
);

create table custom_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  sizes jsonb not null,
  notes text,
  reference_image_url text,
  status text not null default 'pending' check (status in ('pending','shipped','delivered')),
  created_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- All access goes through server code using the service role key.
-- RLS on with no policies = the public anon key can read/write nothing.
alter table products enable row level security;
alter table discount_codes enable row level security;
alter table orders enable row level security;
alter table custom_requests enable row level security;
alter table messages enable row level security;

insert into storage.buckets (id, name, public) values ('flawless', 'flawless', true) on conflict do nothing;
insert into discount_codes (code, percent) values ('WELCOME10', 10) on conflict do nothing;
