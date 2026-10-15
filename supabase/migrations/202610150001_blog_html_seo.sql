-- Idempotent schema bootstrap and SEO migration for the portfolio database.
create extension if not exists pgcrypto;

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  message text not null check (char_length(message) between 10 and 5000),
  created_at timestamptz not null default now()
);
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  meta_title text,
  meta_description text
);
create table if not exists public.page_content (
  key text primary key,
  title text not null,
  body text not null,
  updated_at timestamptz not null default now()
);
create table if not exists public.page_seo (
  path text primary key,
  meta_title text not null,
  meta_description text not null,
  updated_at timestamptz not null default now()
);

alter table public.blog_posts add column if not exists meta_title text;
alter table public.blog_posts add column if not exists meta_description text;
alter table public.blog_posts add column if not exists updated_at timestamptz not null default now();
alter table public.page_seo add column if not exists updated_at timestamptz not null default now();

alter table public.contacts enable row level security;
alter table public.blog_posts enable row level security;
alter table public.page_content enable row level security;
alter table public.page_seo enable row level security;
revoke all on public.contacts, public.blog_posts, public.page_content, public.page_seo from anon, authenticated;
grant usage on schema public to service_role;
grant all privileges on table public.contacts, public.blog_posts, public.page_content, public.page_seo to service_role;
grant insert (name,email,message) on public.contacts to anon, authenticated;
grant select on public.blog_posts to anon, authenticated;

drop policy if exists "Visitors can submit contact forms" on public.contacts;
create policy "Visitors can submit contact forms" on public.contacts for insert to anon, authenticated with check (true);
drop policy if exists "Visitors can read published blog posts" on public.blog_posts;
create policy "Visitors can read published blog posts" on public.blog_posts for select to anon, authenticated using (status = 'published');

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at before update on public.blog_posts
for each row execute function public.set_updated_at();
drop trigger if exists page_content_set_updated_at on public.page_content;
create trigger page_content_set_updated_at before update on public.page_content
for each row execute function public.set_updated_at();
drop trigger if exists page_seo_set_updated_at on public.page_seo;
create trigger page_seo_set_updated_at before update on public.page_seo
for each row execute function public.set_updated_at();

notify pgrst, 'reload schema';
