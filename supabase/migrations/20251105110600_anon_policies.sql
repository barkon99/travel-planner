-- migration: 20251105110600_anon_policies.sql
-- description: create policies for anonymous users to access required public data
-- this ensures unauthenticated users can see necessary data for the application to function

-- policy for anon users to view certain travel plans fields for display on public pages
-- this is limited to only allow viewing specific public travel destinations
create policy "anon users can view public travel plan destinations"
  on travel_plans for select
  to anon
  using (
    -- only allows viewing destinations that are marked as public (in a real app, 
    -- you might have a 'is_public' column - here we're just demonstrating the concept)
    -- in a production app, you would likely add a is_public column and filter on that
    false -- disabled by default, enable when public sharing is implemented
  );

-- policy for anon users to view historical facts that are meant to be public
create policy "anon users can view public historical facts"
  on historical_facts for select
  to anon
  using (
    -- only allows viewing historical facts that are meant to be public
    -- in a real app, this would likely filter based on some condition
    false -- disabled by default, enable when public sharing is implemented
  );

-- Note: By default, all tables have RLS enabled with no policies for anon users,
-- meaning anonymous users cannot access any data unless explicitly allowed
-- through the policies above. 