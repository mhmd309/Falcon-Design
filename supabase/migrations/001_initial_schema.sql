-- Falcon Design CMS Schema
-- Run in Supabase SQL Editor or via CLI

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() ->> 'role') = 'authenticated'
    and exists (
      select 1
      from public.admin_users au
      where au.user_id = auth.uid()
        and au.is_active = true
    ),
    false
  );
$$;

-- ---------------------------------------------------------------------------
-- Admin users (authorization layer on top of Supabase Auth)
-- ---------------------------------------------------------------------------

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger admin_users_updated_at
before update on public.admin_users
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Site settings (singleton-ish company profile)
-- ---------------------------------------------------------------------------

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  company_name_ar text not null default 'فالكون ديزاين',
  company_name_en text not null default 'Falcon Design',
  tagline_ar text,
  tagline_en text,
  logo_url text,
  phone text,
  whatsapp text,
  address_ar text,
  address_en text,
  facebook_url text,
  instagram_url text,
  linkedin_url text,
  youtube_url text,
  x_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Pages + SEO
-- ---------------------------------------------------------------------------

create table if not exists public.site_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ar text not null,
  title_en text not null,
  show_in_navigation boolean not null default true,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  seo_title_ar text,
  seo_title_en text,
  seo_description_ar text,
  seo_description_en text,
  og_title_ar text,
  og_title_en text,
  og_description_ar text,
  og_description_en text,
  og_image text,
  canonical_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_pages_slug_idx on public.site_pages (slug);
create index if not exists site_pages_nav_idx on public.site_pages (show_in_navigation, sort_order);

create trigger site_pages_updated_at
before update on public.site_pages
for each row execute function public.set_updated_at();

-- Flexible key/value section content for Home / About / CTA blocks
create table if not exists public.site_sections (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null references public.site_pages(slug) on delete cascade,
  section_key text not null,
  title_ar text,
  title_en text,
  subtitle_ar text,
  subtitle_en text,
  description_ar text,
  description_en text,
  primary_button_ar text,
  primary_button_en text,
  primary_button_href text,
  secondary_button_ar text,
  secondary_button_en text,
  secondary_button_href text,
  image_url text,
  alt_text_ar text,
  alt_text_en text,
  extra jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_slug, section_key)
);

create index if not exists site_sections_page_idx on public.site_sections (page_slug);

create trigger site_sections_updated_at
before update on public.site_sections
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Home statistics
-- ---------------------------------------------------------------------------

create table if not exists public.statistics (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  prefix text default '',
  suffix text default '',
  label_ar text not null,
  label_en text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists statistics_active_sort_idx
  on public.statistics (is_active, sort_order);

create trigger statistics_updated_at
before update on public.statistics
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_en text not null,
  short_description_ar text,
  short_description_en text,
  description_ar text,
  description_en text,
  image_url text,
  alt_text_ar text,
  alt_text_en text,
  icon text,
  category text not null default 'general',
  is_active boolean not null default true,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  seo_title_ar text,
  seo_title_en text,
  seo_description_ar text,
  seo_description_en text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_active_sort_idx
  on public.services (is_active, is_published, sort_order);
create index if not exists services_featured_idx
  on public.services (is_featured, sort_order);
create index if not exists services_category_idx on public.services (category);

create trigger services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- About content entities
-- ---------------------------------------------------------------------------

create table if not exists public.core_values (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_en text not null,
  description_ar text,
  description_en text,
  icon text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists core_values_active_sort_idx
  on public.core_values (is_active, sort_order);

create trigger core_values_updated_at
before update on public.core_values
for each row execute function public.set_updated_at();

create table if not exists public.timeline_items (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title_ar text not null,
  title_en text not null,
  description_ar text,
  description_en text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists timeline_items_sort_idx
  on public.timeline_items (is_active, sort_order);

create trigger timeline_items_updated_at
before update on public.timeline_items
for each row execute function public.set_updated_at();

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  position_ar text,
  position_en text,
  bio_ar text,
  bio_en text,
  image_url text,
  alt_text_ar text,
  alt_text_en text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists team_members_active_sort_idx
  on public.team_members (is_active, sort_order);

create trigger team_members_updated_at
before update on public.team_members
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Gallery
-- ---------------------------------------------------------------------------

create table if not exists public.gallery_categories (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger gallery_categories_updated_at
before update on public.gallery_categories
for each row execute function public.set_updated_at();

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.gallery_categories(id) on delete set null,
  title_ar text not null,
  title_en text not null,
  description_ar text,
  description_en text,
  image_url text not null,
  alt_text_ar text,
  alt_text_en text,
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_items_active_sort_idx
  on public.gallery_items (is_active, is_published, sort_order);
create index if not exists gallery_items_featured_idx
  on public.gallery_items (is_featured, sort_order);
create index if not exists gallery_items_category_idx
  on public.gallery_items (category_id);

create trigger gallery_items_updated_at
before update on public.gallery_items
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Contact
-- ---------------------------------------------------------------------------

create table if not exists public.contact_settings (
  id uuid primary key default gen_random_uuid(),
  page_title_ar text,
  page_title_en text,
  page_description_ar text,
  page_description_en text,
  company_name_ar text,
  company_name_en text,
  address_ar text,
  address_en text,
  phone text,
  whatsapp text,
  business_hours_ar text,
  business_hours_en text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  google_maps_url text,
  facebook_url text,
  instagram_url text,
  linkedin_url text,
  youtube_url text,
  x_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger contact_settings_updated_at
before update on public.contact_settings
for each row execute function public.set_updated_at();

create table if not exists public.contact_emails (
  id uuid primary key default gen_random_uuid(),
  label_ar text not null,
  label_en text not null,
  email text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_emails_sort_order_unique unique (sort_order),
  constraint contact_emails_sort_order_range check (sort_order between 1 and 5)
);

create trigger contact_emails_updated_at
before update on public.contact_emails
for each row execute function public.set_updated_at();

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'read', 'replied', 'archived')),
  locale text,
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_messages_status_idx
  on public.contact_messages (status, created_at desc);

create trigger contact_messages_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.site_pages enable row level security;
alter table public.site_sections enable row level security;
alter table public.statistics enable row level security;
alter table public.services enable row level security;
alter table public.core_values enable row level security;
alter table public.timeline_items enable row level security;
alter table public.team_members enable row level security;
alter table public.gallery_categories enable row level security;
alter table public.gallery_items enable row level security;
alter table public.contact_settings enable row level security;
alter table public.contact_emails enable row level security;
alter table public.contact_messages enable row level security;

-- Admin users: only admins can read; no public insert
create policy "admins_read_admin_users"
  on public.admin_users for select
  using (public.is_admin());

-- Public read policies
create policy "public_read_site_settings"
  on public.site_settings for select
  using (true);

create policy "public_read_published_pages"
  on public.site_pages for select
  using (is_published = true or public.is_admin());

create policy "public_read_published_sections"
  on public.site_sections for select
  using (is_published = true or public.is_admin());

create policy "public_read_active_statistics"
  on public.statistics for select
  using (is_active = true or public.is_admin());

create policy "public_read_published_services"
  on public.services for select
  using ((is_active = true and is_published = true) or public.is_admin());

create policy "public_read_active_core_values"
  on public.core_values for select
  using (is_active = true or public.is_admin());

create policy "public_read_active_timeline"
  on public.timeline_items for select
  using (is_active = true or public.is_admin());

create policy "public_read_active_team"
  on public.team_members for select
  using (is_active = true or public.is_admin());

create policy "public_read_active_gallery_categories"
  on public.gallery_categories for select
  using (is_active = true or public.is_admin());

create policy "public_read_published_gallery"
  on public.gallery_items for select
  using ((is_active = true and is_published = true) or public.is_admin());

create policy "public_read_contact_settings"
  on public.contact_settings for select
  using (true);

create policy "public_read_active_contact_emails"
  on public.contact_emails for select
  using (is_active = true or public.is_admin());

-- Public can create contact messages only
create policy "public_insert_contact_messages"
  on public.contact_messages for insert
  with check (true);

-- Admin full access
create policy "admins_all_site_settings"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins_all_site_pages"
  on public.site_pages for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins_all_site_sections"
  on public.site_sections for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins_all_statistics"
  on public.statistics for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins_all_services"
  on public.services for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins_all_core_values"
  on public.core_values for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins_all_timeline"
  on public.timeline_items for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins_all_team"
  on public.team_members for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins_all_gallery_categories"
  on public.gallery_categories for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins_all_gallery_items"
  on public.gallery_items for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins_all_contact_settings"
  on public.contact_settings for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins_all_contact_emails"
  on public.contact_emails for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins_select_contact_messages"
  on public.contact_messages for select
  using (public.is_admin());

create policy "admins_update_contact_messages"
  on public.contact_messages for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins_delete_contact_messages"
  on public.contact_messages for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage buckets (run after buckets created in dashboard, or via API)
-- ---------------------------------------------------------------------------
-- Recommended buckets: site-media, gallery
-- Public read; authenticated admin write via storage policies.
