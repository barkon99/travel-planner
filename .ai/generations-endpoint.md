# API Endpoint Implementation Plan: Generate Complete Plan

## 1. Przegląd punktu końcowego
Endpoint `POST /travel-plans/{id}/generate` umożliwia uruchomienie procesu generowania pełnego planu podróży przez sztuczną inteligencję na podstawie wcześniej utworzonego szkieletu planu podróży. Endpoint inicjuje zadanie asynchroniczne, które generuje szczegółowy plan zawierający dzienne harmonogramy, lokalizacje, szacowane koszty oraz fakty historyczne.

## 2. Szczegóły żądania
- **Metoda HTTP**: POST
- **Struktura URL**: `/travel-plans/{id}/generate`
- **Parametry ścieżki**:
  - `id`: UUID - identyfikator planu podróży
- **Request Body**: Brak (endpoint wykorzystuje dane istniejącego planu podróży)
- **Wymagane nagłówki**:
  - `Authorization`: Bearer token uwierzytelniający użytkownika

## 3. Wykorzystywane typy
```typescript
// Istniejące typy z src/types.ts
import { 
  GenerationStatus,  
  AiGenerationStatusDto, 
  TravelPlanResponseDto,
  DetailedTravelPlanDto
} from "../types";

// Nowe typy do implementacji (do dodania do src/types.ts)
export interface GenerationQueueItemDto {
  travel_plan_id: string;
  user_id: string;
  status: GenerationStatus;
  created_at: string;
}

// Command dla usługi generującej
export interface GenerateTravelPlanCommand {
  travelPlanId: string;
  userId: string;
  destination: string;
  durationDays: number;
  travelType: string;
  preferences: string[];
  placesToVisit: string[] | null;
}
```

## 4. Szczegóły odpowiedzi
- **Status 202 Accepted**:
  ```json
  {
    "status": "pending",
    "message": "Travel plan generation has been queued successfully"
  }
  ```
- **Status 400 Bad Request**:
  ```json
  {
    "error": "Bad Request",
    "message": "Travel plan has already been generated"
  }
  ```
- **Status 401 Unauthorized**:
  ```json
  {
    "error": "Unauthorized",
    "message": "Invalid or missing authentication token"
  }
  ```
- **Status 403 Forbidden**:
  ```json
  {
    "error": "Forbidden",
    "message": "You do not have permission to access this resource"
  }
  ```
- **Status 404 Not Found**:
  ```json
  {
    "error": "Not Found", 
    "message": "Travel plan with specified ID not found"
  }
  ```
- **Status 429 Too Many Requests**:
  ```json
  {
    "error": "Too Many Requests",
    "message": "Rate limit exceeded. Please try again later."
  }
  ```

## 5. Przepływ danych
1. Klient wysyła żądanie POST z ID planu podróży
2. Endpoint weryfikuje uwierzytelnienie użytkownika za pomocą Supabase Auth
3. Endpoint sprawdza, czy użytkownik ma uprawnienia do danego planu podróży
4. Endpoint weryfikuje, czy plan podróży istnieje i czy nie został już wygenerowany
5. Endpoint tworzy zadanie asynchroniczne w kolejce generacji planów
6. Endpoint aktualizuje status generacji w planie podróży na "pending"
7. Endpoint zwraca odpowiedź 202 Accepted z informacją o statusie
8. Serwis tła pobiera zadania z kolejki i generuje szczegółowy plan podróży
9. Serwis tła zapisuje wygenerowane dane w bazie danych:
   - Tworzy dzienne plany (day_plans)
   - Tworzy lokalizacje dla każdego dnia (locations)
   - Tworzy szacunkowe koszty dla każdego dnia (estimated_costs)
   - Tworzy fakty historyczne (historical_facts)
10. Serwis tła aktualizuje status generacji w planie podróży na "completed" lub "failed"

## 6. Względy bezpieczeństwa
1. **Uwierzytelnianie**:
   - Wszystkie żądania muszą zawierać poprawny token JWT w nagłówku Authorization
   - Tokeny JWT są weryfikowane przez middleware Astro

2. **Autoryzacja**:
   - Implementacja zabezpieczeń RLS w Supabase dla tabeli travel_plans
   - Sprawdzanie, czy zalogowany użytkownik jest właścicielem planu podróży
   - Użycie user_id z kontekstu uwierzytelniania, a nie z ciała żądania

3. **Walidacja danych**:
   - Sprawdzanie poprawności UUID planu podróży
   - Weryfikacja, czy plan podróży istnieje
   - Weryfikacja, czy plan podróży nie został już wygenerowany

4. **Kontrola dostępu**:
   - Wykorzystanie Row Level Security (RLS) Supabase do filtrowania danych
   - Stosowanie zasady minimalnych uprawnień w zapytaniach do bazy danych

5. **Ograniczenie szybkości**:
   - Implementacja limitu generacji planów na użytkownika (np. 5 dziennie)
   - Implementacja globalnego limitu jednoczesnych generacji

## 7. Obsługa błędów
1. **Błędy uwierzytelniania i autoryzacji**:
   - 401 Unauthorized - brak lub nieprawidłowy token
   - 403 Forbidden - brak uprawnień do danego planu podróży

2. **Błędy zasobów**:
   - 404 Not Found - plan podróży nie istnieje

3. **Błędy walidacji**:
   - 400 Bad Request - plan już wygenerowany lub inne błędy walidacji

4. **Błędy limitów**:
   - 429 Too Many Requests - przekroczony limit generacji planów

5. **Błędy wewnętrzne**:
   - 500 Internal Server Error - nieoczekiwane błędy serwera
   - Logowanie szczegółów błędów do celów debugowania
   - Zwracanie ogólnych komunikatów błędów użytkownikom