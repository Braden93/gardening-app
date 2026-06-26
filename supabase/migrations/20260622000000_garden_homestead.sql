-- Garden & Homestead Planning: core tables for all 15 modules

create table if not exists public.garden_profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade unique,
  zip_code        text,
  hardiness_zone  text,
  frost_date_last text,
  frost_date_first text,
  family_size     integer default 4,
  garden_sqft     integer,
  pasture_acres   numeric,
  space_type      text default 'backyard',
  experience_level text default 'beginner',
  goals           text[] default '{}',
  water_source    text default 'municipal',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.garden_beds (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  layout_type   text default 'raised_bed',
  width_ft      numeric default 4,
  length_ft     numeric default 8,
  sun_exposure  text default 'full_sun',
  notes         text,
  position_x    integer default 0,
  position_y    integer default 0,
  created_at    timestamptz not null default now()
);

create table if not exists public.garden_plantings (
  id           uuid primary key default gen_random_uuid(),
  bed_id       uuid references public.garden_beds(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  plant_name   text not null,
  plant_family text,
  plant_type   text default 'annual',
  year         integer not null default extract(year from now())::integer,
  season       text,
  start_date   date,
  harvest_date date,
  notes        text,
  created_at   timestamptz not null default now()
);

create table if not exists public.garden_tasks (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  planting_id  uuid references public.garden_plantings(id) on delete set null,
  bed_id       uuid references public.garden_beds(id) on delete set null,
  title        text not null,
  task_type    text not null,
  due_date     date not null,
  completed_at timestamptz,
  notes        text,
  created_at   timestamptz not null default now()
);

create table if not exists public.homestead_animals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  animal_type text not null,
  breed       text,
  count       integer default 1,
  setup_date  date,
  notes       text,
  created_at  timestamptz not null default now()
);

create table if not exists public.roadmap_completions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  phase        integer not null,
  item_key     text not null,
  completed_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  unique(user_id, phase, item_key)
);

-- Indexes
create index if not exists idx_garden_beds_user        on public.garden_beds(user_id);
create index if not exists idx_garden_plantings_user   on public.garden_plantings(user_id);
create index if not exists idx_garden_plantings_bed    on public.garden_plantings(bed_id);
create index if not exists idx_garden_tasks_user       on public.garden_tasks(user_id);
create index if not exists idx_garden_tasks_due        on public.garden_tasks(user_id, due_date);
create index if not exists idx_homestead_animals_user  on public.homestead_animals(user_id);
create index if not exists idx_roadmap_completions_user on public.roadmap_completions(user_id);

-- RLS
alter table public.garden_profiles      enable row level security;
alter table public.garden_beds          enable row level security;
alter table public.garden_plantings     enable row level security;
alter table public.garden_tasks         enable row level security;
alter table public.homestead_animals    enable row level security;
alter table public.roadmap_completions  enable row level security;

create policy "Users own their garden profile"
  on public.garden_profiles for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own their garden beds"
  on public.garden_beds for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own their plantings"
  on public.garden_plantings for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own their tasks"
  on public.garden_tasks for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own their animals"
  on public.homestead_animals for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own their roadmap"
  on public.roadmap_completions for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
