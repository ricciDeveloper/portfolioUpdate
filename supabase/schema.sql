create extension if not exists pgcrypto;
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  message text not null check (char_length(message) between 10 and 5000),
  created_at timestamptz not null default now()
);
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique,
  excerpt text not null, content text not null,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), published_at timestamptz
);
create index if not exists blog_posts_publication_idx on public.blog_posts(status, published_at desc);
create table if not exists public.page_content (key text primary key, title text not null, body text not null, updated_at timestamptz not null default now());
alter table public.contacts enable row level security;
alter table public.blog_posts enable row level security;
alter table public.page_content enable row level security;
revoke all on public.contacts, public.blog_posts, public.page_content from anon, authenticated;
grant insert (name,email,message) on public.contacts to anon, authenticated;
grant select on public.blog_posts to anon, authenticated;
create policy "Visitors can submit contact forms" on public.contacts for insert to anon, authenticated with check (true);
create policy "Visitors can read published blog posts" on public.blog_posts for select to anon, authenticated using (status = 'published');
insert into public.blog_posts (title, slug, excerpt, content, status, published_at)
values ('Como transformar uma ideia em um produto digital','como-transformar-ideia-em-produto-digital','Um caminho enxuto para sair da ideia, validar o problema e construir uma primeira versão útil.','Toda boa solução começa com um problema real. Antes de escolher ferramentas ou desenhar telas, converse com as pessoas que enfrentam esse problema e entenda como elas lidam com ele hoje.\n\nCom esse aprendizado, defina uma primeira versão pequena: uma entrega que resolva a parte mais importante da necessidade sem acumular recursos que ainda não foram validados.\n\nDepois de publicar, acompanhe o uso, peça feedback e ajuste o produto com frequência. Esse ciclo de descoberta, construção e aprendizado ajuda a investir energia no que gera valor de verdade.','published',now()) on conflict (slug) do nothing;
