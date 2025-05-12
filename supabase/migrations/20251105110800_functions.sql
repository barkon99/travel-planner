-- migration: 20251105110800_functions.sql
-- description: create useful functions for the application
-- implements helper functions for common operations

-- function to get all travel plans for a user
create or replace function get_user_travel_plans(user_id uuid)
returns setof travel_plans as $$
begin
  return query
    select * from travel_plans 
    where travel_plans.user_id = get_user_travel_plans.user_id
    order by created_at desc;
end;
$$ language plpgsql security definer;

-- function to get a complete travel plan with all related data
create or replace function get_complete_travel_plan(travel_plan_id uuid)
returns json as $$
declare
  result json;
begin
  -- get the travel plan with its day plans, locations, estimated costs, historical facts, and notes
  select json_build_object(
    'travel_plan', row_to_json(tp),
    'day_plans', (
      select json_agg(
        json_build_object(
          'day_plan', row_to_json(dp),
          'locations', (
            select json_agg(row_to_json(l))
            from locations l
            where l.day_plan_id = dp.id
          ),
          'estimated_costs', (
            select row_to_json(ec)
            from estimated_costs ec
            where ec.day_plan_id = dp.id
          )
        )
      )
      from day_plans dp
      where dp.travel_plan_id = tp.id
      order by dp.day_number
    ),
    'historical_facts', (
      select json_agg(row_to_json(hf))
      from historical_facts hf
      where hf.travel_plan_id = tp.id
    ),
    'user_notes', (
      select json_agg(row_to_json(un))
      from user_notes un
      where un.travel_plan_id = tp.id
      order by un.created_at desc
    ),
    'ai_responses', (
      select json_agg(row_to_json(ar))
      from ai_responses ar
      where ar.travel_plan_id = tp.id
      order by ar.created_at desc
    )
  ) into result
  from travel_plans tp
  where tp.id = get_complete_travel_plan.travel_plan_id;

  return result;
end;
$$ language plpgsql security definer;

-- function to add a historical fact to a travel plan
create or replace function add_historical_fact(
  p_travel_plan_id uuid,
  p_place text,
  p_description text
) returns uuid as $$
declare
  new_fact_id uuid;
begin
  -- check if the user has access to this travel plan
  if not exists (
    select 1 from travel_plans 
    where id = p_travel_plan_id and user_id = auth.uid()
  ) then
    raise exception 'Access denied to travel plan';
  end if;

  -- insert the new historical fact
  insert into historical_facts (travel_plan_id, place, description)
  values (p_travel_plan_id, p_place, p_description)
  returning id into new_fact_id;

  return new_fact_id;
end;
$$ language plpgsql security definer;

-- function to log user events
create or replace function log_user_event(
  p_event_type text
) returns uuid as $$
declare
  new_log_id uuid;
begin
  -- validate event type
  if p_event_type not in ('registration', 'login', 'profile_update', 'plan_creation', 'plan_edit') then
    raise exception 'Invalid event type';
  end if;

  -- insert the new event log
  insert into event_logs (user_id, event_type)
  values (auth.uid(), p_event_type)
  returning id into new_log_id;

  return new_log_id;
end;
$$ language plpgsql security definer; 