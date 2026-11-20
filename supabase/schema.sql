-- NoeloTools Admin database schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin' check (role in ('owner','admin','editor')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text,
  url text,
  description text,
  status text not null default 'published' check(status in ('draft','published','disabled')),
  seo_title text,
  seo_description text,
  updated_at timestamptz not null default now()
);
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null default '',
  status text not null default 'draft' check(status in ('draft','published','scheduled')),
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.site_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null default '',
  status text not null default 'draft' check(status in ('draft','published')),
  seo_title text,
  seo_description text,
  updated_at timestamptz not null default now()
);
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  public_url text,
  alt_text text,
  created_at timestamptz not null default now()
);
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.admin_users a where a.user_id=auth.uid() and a.active=true and a.role in ('owner','admin')) $$;
create or replace function public.is_editor_or_admin()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.admin_users a where a.user_id=auth.uid() and a.active=true and a.role in ('owner','admin','editor')) $$;

alter table public.admin_users enable row level security;
alter table public.tools enable row level security;
alter table public.blog_posts enable row level security;
alter table public.site_pages enable row level security;
alter table public.media_assets enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;

-- Admin allowlist rows are provisioned manually by the project owner in SQL Editor.
create policy "admins read own admin record" on public.admin_users for select to authenticated using (user_id=auth.uid() or public.is_admin());
create policy "editors read tools" on public.tools for select to authenticated using (public.is_editor_or_admin());
create policy "admins manage tools" on public.tools for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "editors read posts" on public.blog_posts for select to authenticated using (public.is_editor_or_admin());
create policy "editors manage posts" on public.blog_posts for all to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "editors read pages" on public.site_pages for select to authenticated using (public.is_editor_or_admin());
create policy "admins manage pages" on public.site_pages for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage media" on public.media_assets for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins read audit" on public.audit_logs for select to authenticated using (public.is_admin());
create policy "authenticated insert audit" on public.audit_logs for insert to authenticated with check (actor=auth.uid());

-- Seed the exact NoeloTools catalogue (29 entries).
insert into public.tools(slug,name,category,url,status) values
('merge-pdf','Merge PDF','PDF','/noelotools/tools/merge-pdf/','published'),
('compress-pdf','Compress PDF','PDF','/noelotools/tools/compress-pdf/','published'),
('loan-calculator','Loan Calculator','Money & Tax','/noelotools/tools/loan-calculator/','published'),
('vat-calculator','VAT Calculator','Money & Tax','/noelotools/tools/vat-calculator/','published'),
('europe-salary-calculator','International Salary Calculator','Money & Tax','/noelotools/tools/europe-salary-calculator/','published'),
('currency-converter','Currency Converter','Money & Tax','/noelotools/tools/currency-converter/','published'),
('bmi-calculator','BMI Calculator','Health','/noelotools/tools/bmi-calculator/','published'),
('word-counter','Word Counter','Writing','/noelotools/tools/word-counter/','published'),
('qr-code-generator','QR Code Generator','Everyday','/noelotools/tools/qr-code-generator/','published'),
('password-generator','Password Generator','Developer','/noelotools/tools/password-generator/','published'),
('percentage-calculator','Percentage Calculator','Math','/noelotools/tools/percentage-calculator/','published'),
('unit-converter','Unit Converter','Everyday','/noelotools/tools/unit-converter/','published'),
('age-calculator','Age Calculator','Everyday','/noelotools/tools/age-calculator/','published'),
('date-difference-calculator','Date Difference Calculator','Everyday','/noelotools/tools/date-difference-calculator/','published'),
('json-formatter','JSON Formatter','Developer','/noelotools/tools/json-formatter/','published'),
('base64-encoder-decoder','Base64 Encoder & Decoder','Developer','/noelotools/tools/base64-encoder-decoder/','published'),
('text-case-converter','Text Case Converter','Writing','/noelotools/tools/text-case-converter/','published'),
('image-compressor','Image Compressor','Media','/noelotools/tools/image-compressor/','published'),
('image-resizer','Image Resizer','Media','/noelotools/tools/image-resizer/','published'),
('iban-validator','IBAN Validator','Money & Tax','/noelotools/tools/iban-validator/','published'),
('stopwatch','Stopwatch','Everyday','/noelotools/tools/stopwatch/','published'),
('random-number-generator','Random Number Generator','Math','/noelotools/tools/random-number-generator/','published'),
('color-picker','Color Picker','Developer','/noelotools/tools/color-picker/','published'),
('typing-speed-test','Typing Speed Test','Writing','/noelotools/tools/typing-speed-test/','published'),
('unit-price-calculator','Unit Price Calculator','Money & Tax','/noelotools/tools/unit-price-calculator/','published'),
('sales-tax-calculator','Sales Tax Calculator','Money & Tax','/noelotools/tools/sales-tax-calculator/','published'),
('time-zone-converter','Time Zone Converter','Everyday','/noelotools/tools/time-zone-converter/','published'),
('scientific-calculator','Scientific Calculator','Math','/noelotools/tools/scientific-calculator/','published'),
('pdf-table-to-excel','PDF Table to Excel','PDF','/noelotools/tools/pdf-table-to-excel/','published')
on conflict(slug) do update set name=excluded.name,category=excluded.category,url=excluded.url;

-- After creating your first user via Supabase Auth, run this with that exact account:
-- insert into public.admin_users(user_id,email,role,active)
-- select id,email,'owner',true from auth.users where lower(email)=lower('YOUR_ADMIN_EMAIL');
