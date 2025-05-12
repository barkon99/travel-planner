# VibeTravels Database

This directory contains the database schema and migrations for the VibeTravels application. The database is managed using Supabase and PostgreSQL.

## Database Structure

The database consists of the following tables:

- **travel_plans**: Stores information about travel plans created by users
- **day_plans**: Contains details for each day of a travel plan
- **locations**: Stores attractions, restaurants, and activities for each day plan
- **estimated_costs**: Records cost estimates for each day plan
- **historical_facts**: Contains historical information about travel destinations
- **user_notes**: Stores user notes about their travel plans
- **ai_responses**: Contains AI-generated responses for travel plans
- **event_logs**: Logs user events for auditing purposes

## Migrations

The migrations are organized as follows:

1. **20251105110500_initial_schema.sql**: Creates all the tables, constraints, and indexes
2. **20251105110600_anon_policies.sql**: Sets up RLS policies for anonymous users
3. **20251105110700_triggers.sql**: Creates triggers for automatically updating timestamps
4. **20251105110800_functions.sql**: Implements helper functions for common operations

## Security

All tables have Row Level Security (RLS) enabled with appropriate policies to ensure users can only access their own data. The `authenticated` role can view, create, update, and delete their own data, while the `anon` role has very limited access.

## Helper Functions

The database includes several helper functions:

- `get_user_travel_plans`: Retrieves all travel plans for a user
- `get_complete_travel_plan`: Gets a complete travel plan with all related data
- `add_historical_fact`: Adds a historical fact to a travel plan
- `log_user_event`: Logs user events for auditing purposes

## Usage

These migrations will be applied automatically when running `supabase start` or manually using `supabase db reset`. 

When making changes to the database schema, create a new migration file with the following naming convention:
`YYYYMMDDHHmmss_description.sql` (e.g., `20251105110900_add_user_preferences.sql`).

## Relations

The database includes the following relationships:

- Users (1) → (N) Travel Plans
- Travel Plans (1) → (N) Day Plans
- Day Plans (1) → (N) Locations
- Day Plans (1) → (1) Estimated Costs
- Travel Plans (1) → (N) Historical Facts
- Travel Plans (1) → (N) User Notes
- Travel Plans (1) → (N) AI Responses
- Users (1) → (N) Event Logs 