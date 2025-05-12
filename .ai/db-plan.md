# Schemat bazy danych VibeTravels

## 1. Lista tabel z ich kolumnami, typami danych i ograniczeniami

### users

This table is managed by Supabase Auth

- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `email` TEXT UNIQUE NOT NULL
- `password_hash` TEXT NOT NULL
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
- `last_login` TIMESTAMP WITH TIME ZONE

### travel_plans
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `destination` TEXT NOT NULL
- `duration_days` INTEGER NOT NULL CHECK (duration_days > 0 AND duration_days <= 30)
- `travel_type` TEXT NOT NULL CHECK (travel_type IN ('budget', 'medium', 'luxury'))
- `preferences` TEXT[] NOT NULL CHECK (array_length(preferences, 1) <= 10)
- `places_to_visit` TEXT[]
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
- `updated_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()

### day_plans
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `travel_plan_id` UUID NOT NULL REFERENCES travel_plans(id) ON DELETE CASCADE
- `day_number` INTEGER NOT NULL CHECK (day_number > 0)
- `summary` TEXT NOT NULL
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
- `updated_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
- UNIQUE (travel_plan_id, day_number)

### locations
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `day_plan_id` UUID NOT NULL REFERENCES day_plans(id) ON DELETE CASCADE
- `name` TEXT NOT NULL
- `description` TEXT NOT NULL
- `type` TEXT NOT NULL CHECK (type IN ('attraction', 'restaurant', 'activity'))
- `latitude` NUMERIC(10, 8)
- `longitude` NUMERIC(11, 8)
- `cost` NUMERIC(10, 2)
- `time_needed` INTEGER
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
- `updated_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()

### estimated_costs
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `day_plan_id` UUID NOT NULL REFERENCES day_plans(id) ON DELETE CASCADE
- `accommodation` NUMERIC(10, 2) NOT NULL DEFAULT 0
- `transport` NUMERIC(10, 2) NOT NULL DEFAULT 0
- `food` NUMERIC(10, 2) NOT NULL DEFAULT 0
- `attractions` NUMERIC(10, 2) NOT NULL DEFAULT 0
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
- `updated_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
- UNIQUE (day_plan_id)

### historical_facts
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `travel_plan_id` UUID NOT NULL REFERENCES travel_plans(id) ON DELETE CASCADE
- `place` TEXT NOT NULL
- `description` TEXT NOT NULL CHECK (length(description) <= 1000)
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()

### user_notes
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `travel_plan_id` UUID NOT NULL REFERENCES travel_plans(id) ON DELETE CASCADE
- `notes_text` TEXT NOT NULL CHECK (length(notes_text) <= 500)
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()

### ai_responses
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `travel_plan_id` UUID NOT NULL REFERENCES travel_plans(id) ON DELETE CASCADE
- `response_text` TEXT NOT NULL
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()

### event_logs
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `event_type` TEXT NOT NULL CHECK (event_type IN ('registration', 'login', 'profile_update', 'plan_creation', 'plan_edit'))
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()

## 2. Relacje między tabelami

### Relacje jeden-do-wielu
- Users (1) → (N) Travel Plans
- Travel Plans (1) → (N) Day Plans
- Day Plans (1) → (N) Locations
- Travel Plans (1) → (N) Historical Facts
- Travel Plans (1) → (N) User Notes
- Travel Plans (1) → (N) AI Responses
- Users (1) → (N) Event Logs

### Relacje jeden-do-jeden
- Day Plans (1) → (1) Estimated Costs

## 3. Indeksy

- **Indeksy dla kluczy obcych**
  - `idx_travel_plans_user_id` na travel_plans(user_id)
  - `idx_day_plans_travel_plan_id` na day_plans(travel_plan_id)
  - `idx_locations_day_plan_id` na locations(day_plan_id)
  - `idx_estimated_costs_day_plan_id` na estimated_costs(day_plan_id)
  - `idx_historical_facts_travel_plan_id` na historical_facts(travel_plan_id)
  - `idx_user_notes_travel_plan_id` na user_notes(travel_plan_id)
  - `idx_ai_responses_travel_plan_id` na ai_responses(travel_plan_id)
  - `idx_event_logs_user_id` na event_logs(user_id)

- **Dodatkowe indeksy**
  - `idx_travel_plans_destination` na travel_plans(destination)
  - `idx_locations_type` na locations(type)
  - `idx_event_logs_event_type` na event_logs(event_type)
  - `idx_event_logs_created_at` na event_logs(created_at)


## 5. Dodatkowe uwagi

1. Tabela `users` integruje się z wbudowanym systemem autentykacji Supabase.
2. Preferencje podróży są przechowywane jako tablica w tabeli `travel_plans`, z maksymalną liczbą 10 preferencji.
3. Obsługiwane typy podróży to 'budget' (budżetowy), 'medium' (średni) i 'luxury' (luksusowy).
4. Typy lokalizacji to 'attraction' (atrakcja), 'restaurant' (restauracja) i 'activity' (aktywność).
5. Typy zdarzeń w logach obejmują 'registration' (rejestracja), 'login' (logowanie), 'profile_update' (aktualizacja profilu), 'plan_creation' (tworzenie planu) i 'plan_edit' (edycja planu).
6. Maksymalna długość podróży ograniczona jest do 30 dni zgodnie z wymaganiami.
7. Zastosowano ograniczenia długości tekstu dla notatek użytkownika (500 znaków) i faktów historycznych (1000 znaków).
8. Polityki RLS zapewniają, że użytkownicy mają dostęp tylko do własnych danych.
9. Ograniczenia kluczy obcych wykorzystują CASCADE przy usuwaniu w celu zachowania integralności danych.
10. Dla każdego dnia planu możliwe jest maksymalnie 5 atrakcji/miejsc/aktywności (poza restauracjami), co jest egzekwowane na poziomie aplikacji. 