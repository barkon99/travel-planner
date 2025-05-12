-- migration: 20251105110700_triggers.sql
-- description: create triggers for automatically updating timestamps
-- implements updated_at functionality for tables that need it

-- create function to update timestamp on records
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- create triggers for each table that has an updated_at column

-- travel_plans update trigger
create trigger update_travel_plans_updated_at
  before update on travel_plans
  for each row
  execute procedure update_updated_at_column();

-- day_plans update trigger
create trigger update_day_plans_updated_at
  before update on day_plans
  for each row
  execute procedure update_updated_at_column();

-- locations update trigger
create trigger update_locations_updated_at
  before update on locations
  for each row
  execute procedure update_updated_at_column();

-- estimated_costs update trigger
create trigger update_estimated_costs_updated_at
  before update on estimated_costs
  for each row
  execute procedure update_updated_at_column(); 