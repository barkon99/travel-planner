-- migration: 20251105110500_initial_schema.sql
-- description: initial schema setup for vibetravels application
-- creates all tables, constraints, indexes and row level security policies

-- travel_plans table
create table travel_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination text not null,
  duration_days integer not null check (duration_days > 0 and duration_days <= 30),
  travel_type text not null check (travel_type in ('budget', 'medium', 'luxury')),
  preferences text[] not null check (array_length(preferences, 1) <= 10),
  places_to_visit text[],
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- enable row level security for travel_plans
alter table travel_plans enable row level security;

-- create rls policies for travel_plans
-- policy for select operations by authenticated users
create policy "authenticated users can view their own travel plans"
  on travel_plans for select
  to authenticated
  using (auth.uid() = user_id);

-- policy for insert operations by authenticated users
create policy "authenticated users can create their own travel plans"
  on travel_plans for insert
  to authenticated
  with check (auth.uid() = user_id);

-- policy for update operations by authenticated users
create policy "authenticated users can update their own travel plans"
  on travel_plans for update
  to authenticated
  using (auth.uid() = user_id);

-- policy for delete operations by authenticated users
create policy "authenticated users can delete their own travel plans"
  on travel_plans for delete
  to authenticated
  using (auth.uid() = user_id);

-- day_plans table
create table day_plans (
  id uuid primary key default gen_random_uuid(),
  travel_plan_id uuid not null references travel_plans(id) on delete cascade,
  day_number integer not null check (day_number > 0),
  summary text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (travel_plan_id, day_number)
);

-- enable row level security for day_plans
alter table day_plans enable row level security;

-- create rls policies for day_plans
create policy "authenticated users can view their own day plans"
  on day_plans for select
  to authenticated
  using (exists (
    select 1 from travel_plans tp 
    where tp.id = day_plans.travel_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can create their own day plans"
  on day_plans for insert
  to authenticated
  with check (exists (
    select 1 from travel_plans tp 
    where tp.id = day_plans.travel_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can update their own day plans"
  on day_plans for update
  to authenticated
  using (exists (
    select 1 from travel_plans tp 
    where tp.id = day_plans.travel_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can delete their own day plans"
  on day_plans for delete
  to authenticated
  using (exists (
    select 1 from travel_plans tp 
    where tp.id = day_plans.travel_plan_id and tp.user_id = auth.uid()
  ));

-- locations table
create table locations (
  id uuid primary key default gen_random_uuid(),
  day_plan_id uuid not null references day_plans(id) on delete cascade,
  name text not null,
  description text not null,
  type text not null check (type in ('attraction', 'restaurant', 'activity')),
  latitude numeric(10, 8),
  longitude numeric(11, 8),
  cost numeric(10, 2),
  time_needed integer,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- enable row level security for locations
alter table locations enable row level security;

-- create rls policies for locations
create policy "authenticated users can view their own locations"
  on locations for select
  to authenticated
  using (exists (
    select 1 from day_plans dp
    join travel_plans tp on dp.travel_plan_id = tp.id
    where dp.id = locations.day_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can create their own locations"
  on locations for insert
  to authenticated
  with check (exists (
    select 1 from day_plans dp
    join travel_plans tp on dp.travel_plan_id = tp.id
    where dp.id = locations.day_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can update their own locations"
  on locations for update
  to authenticated
  using (exists (
    select 1 from day_plans dp
    join travel_plans tp on dp.travel_plan_id = tp.id
    where dp.id = locations.day_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can delete their own locations"
  on locations for delete
  to authenticated
  using (exists (
    select 1 from day_plans dp
    join travel_plans tp on dp.travel_plan_id = tp.id
    where dp.id = locations.day_plan_id and tp.user_id = auth.uid()
  ));

-- estimated_costs table
create table estimated_costs (
  id uuid primary key default gen_random_uuid(),
  day_plan_id uuid not null references day_plans(id) on delete cascade,
  accommodation numeric(10, 2) not null default 0,
  transport numeric(10, 2) not null default 0,
  food numeric(10, 2) not null default 0,
  attractions numeric(10, 2) not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (day_plan_id)
);

-- enable row level security for estimated_costs
alter table estimated_costs enable row level security;

-- create rls policies for estimated_costs
create policy "authenticated users can view their own estimated costs"
  on estimated_costs for select
  to authenticated
  using (exists (
    select 1 from day_plans dp
    join travel_plans tp on dp.travel_plan_id = tp.id
    where dp.id = estimated_costs.day_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can create their own estimated costs"
  on estimated_costs for insert
  to authenticated
  with check (exists (
    select 1 from day_plans dp
    join travel_plans tp on dp.travel_plan_id = tp.id
    where dp.id = estimated_costs.day_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can update their own estimated costs"
  on estimated_costs for update
  to authenticated
  using (exists (
    select 1 from day_plans dp
    join travel_plans tp on dp.travel_plan_id = tp.id
    where dp.id = estimated_costs.day_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can delete their own estimated costs"
  on estimated_costs for delete
  to authenticated
  using (exists (
    select 1 from day_plans dp
    join travel_plans tp on dp.travel_plan_id = tp.id
    where dp.id = estimated_costs.day_plan_id and tp.user_id = auth.uid()
  ));

-- historical_facts table
create table historical_facts (
  id uuid primary key default gen_random_uuid(),
  travel_plan_id uuid not null references travel_plans(id) on delete cascade,
  place text not null,
  description text not null check (length(description) <= 1000),
  created_at timestamp with time zone not null default now()
);

-- enable row level security for historical_facts
alter table historical_facts enable row level security;

-- create rls policies for historical_facts
create policy "authenticated users can view their own historical facts"
  on historical_facts for select
  to authenticated
  using (exists (
    select 1 from travel_plans tp
    where tp.id = historical_facts.travel_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can create their own historical facts"
  on historical_facts for insert
  to authenticated
  with check (exists (
    select 1 from travel_plans tp
    where tp.id = historical_facts.travel_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can update their own historical facts"
  on historical_facts for update
  to authenticated
  using (exists (
    select 1 from travel_plans tp
    where tp.id = historical_facts.travel_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can delete their own historical facts"
  on historical_facts for delete
  to authenticated
  using (exists (
    select 1 from travel_plans tp
    where tp.id = historical_facts.travel_plan_id and tp.user_id = auth.uid()
  ));

-- user_notes table
create table user_notes (
  id uuid primary key default gen_random_uuid(),
  travel_plan_id uuid not null references travel_plans(id) on delete cascade,
  notes_text text not null check (length(notes_text) <= 500),
  created_at timestamp with time zone not null default now()
);

-- enable row level security for user_notes
alter table user_notes enable row level security;

-- create rls policies for user_notes
create policy "authenticated users can view their own notes"
  on user_notes for select
  to authenticated
  using (exists (
    select 1 from travel_plans tp
    where tp.id = user_notes.travel_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can create their own notes"
  on user_notes for insert
  to authenticated
  with check (exists (
    select 1 from travel_plans tp
    where tp.id = user_notes.travel_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can update their own notes"
  on user_notes for update
  to authenticated
  using (exists (
    select 1 from travel_plans tp
    where tp.id = user_notes.travel_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can delete their own notes"
  on user_notes for delete
  to authenticated
  using (exists (
    select 1 from travel_plans tp
    where tp.id = user_notes.travel_plan_id and tp.user_id = auth.uid()
  ));

-- ai_responses table
create table ai_responses (
  id uuid primary key default gen_random_uuid(),
  travel_plan_id uuid not null references travel_plans(id) on delete cascade,
  response_text text not null,
  created_at timestamp with time zone not null default now()
);

-- enable row level security for ai_responses
alter table ai_responses enable row level security;

-- create rls policies for ai_responses
create policy "authenticated users can view their own ai responses"
  on ai_responses for select
  to authenticated
  using (exists (
    select 1 from travel_plans tp
    where tp.id = ai_responses.travel_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can create their own ai responses"
  on ai_responses for insert
  to authenticated
  with check (exists (
    select 1 from travel_plans tp
    where tp.id = ai_responses.travel_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can update their own ai responses"
  on ai_responses for update
  to authenticated
  using (exists (
    select 1 from travel_plans tp
    where tp.id = ai_responses.travel_plan_id and tp.user_id = auth.uid()
  ));

create policy "authenticated users can delete their own ai responses"
  on ai_responses for delete
  to authenticated
  using (exists (
    select 1 from travel_plans tp
    where tp.id = ai_responses.travel_plan_id and tp.user_id = auth.uid()
  ));

-- event_logs table
create table event_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null check (event_type in ('registration', 'login', 'profile_update', 'plan_creation', 'plan_edit')),
  created_at timestamp with time zone not null default now()
);

-- enable row level security for event_logs
alter table event_logs enable row level security;

-- create rls policies for event_logs
create policy "authenticated users can view their own event logs"
  on event_logs for select
  to authenticated
  using (auth.uid() = user_id);

create policy "authenticated users can create their own event logs"
  on event_logs for insert
  to authenticated
  with check (auth.uid() = user_id);

-- only system can update event logs (no policy needed as we don't want users to update logs)

-- only system can delete event logs (no policy needed as we don't want users to delete logs)

-- create indices
create index idx_travel_plans_user_id on travel_plans(user_id);
create index idx_day_plans_travel_plan_id on day_plans(travel_plan_id);
create index idx_locations_day_plan_id on locations(day_plan_id);
create index idx_estimated_costs_day_plan_id on estimated_costs(day_plan_id);
create index idx_historical_facts_travel_plan_id on historical_facts(travel_plan_id);
create index idx_user_notes_travel_plan_id on user_notes(travel_plan_id);
create index idx_ai_responses_travel_plan_id on ai_responses(travel_plan_id);
create index idx_event_logs_user_id on event_logs(user_id);

-- additional indices for performance
create index idx_travel_plans_destination on travel_plans(destination);
create index idx_locations_type on locations(type);
create index idx_event_logs_event_type on event_logs(event_type);
create index idx_event_logs_created_at on event_logs(created_at); 