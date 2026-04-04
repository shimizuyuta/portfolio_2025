-- articles テーブル
create table articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  excerpt text not null,
  category text not null,
  status text not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- tags テーブル
create table tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

-- article_tags 中間テーブル
create table article_tags (
  article_id uuid not null references articles(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- RLS
alter table articles enable row level security;
alter table tags enable row level security;
alter table article_tags enable row level security;

-- 公開記事のみ読み取り可
create policy "公開記事は誰でも読める"
  on articles for select
  using (status = 'published' and published_at is not null and published_at <= now());

create policy "タグは誰でも読める"
  on tags for select using (true);

create policy "記事タグは誰でも読める"
  on article_tags for select using (true);

-- updated_at 自動更新
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger articles_updated_at
  before update on articles
  for each row execute function update_updated_at();
