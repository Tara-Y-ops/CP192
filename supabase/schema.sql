create table if not exists profiles (
  user_id text primary key,
  email text not null,
  display_name text not null,
  focus_area text not null,
  created_at timestamptz not null default now()
);

create table if not exists cycles (
  id uuid primary key,
  user_id text not null references profiles(user_id) on delete cascade,
  theme text not null,
  emotion text not null,
  energy_level text not null,
  blocker text not null,
  resistance_reason text not null,
  effort_level text not null,
  desired_outcome text not null,
  reflection_text text not null,
  status text not null check (status in ('reflecting', 'pending', 'completed', 'reviewed')),
  selected_action_option_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists action_options (
  id uuid primary key,
  cycle_id uuid not null references cycles(id) on delete cascade,
  source text not null check (source in ('ai', 'custom')),
  title text not null,
  description text not null,
  estimated_minutes integer not null,
  rationale text not null,
  is_selected boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key,
  cycle_id uuid not null unique references cycles(id) on delete cascade,
  what_happened text not null,
  emotional_shift text not null,
  engagement_score integer not null,
  continue_willingness integer not null,
  feel_more_stable boolean not null,
  surprised_by text not null,
  created_at timestamptz not null default now()
);
