
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null default 'Other',
  condition text not null default 'Good',
  price numeric(10,2) not null default 0 check (price >= 0),
  image_url text,
  status text not null default 'available'
    check (status in ('available', 'reserved', 'exchanged')),
  created_at timestamptz not null default now()
);

alter table public.items enable row level security;

drop policy if exists "View available items" on public.items;
create policy "View available items"
on public.items for select
using (status = 'available' or auth.uid() = user_id);

drop policy if exists "Insert own items" on public.items;
create policy "Insert own items"
on public.items for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Update own items" on public.items;
create policy "Update own items"
on public.items for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Delete own items" on public.items;
create policy "Delete own items"
on public.items for delete to authenticated
using (auth.uid() = user_id);
