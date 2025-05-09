# VibeTravels

Generator planów podróży oparty na sztucznej inteligencji, tworzący spersonalizowane plany podróży dzień po dniu.

## Opis

VibeTravels to aplikacja webowa, która umożliwia użytkownikom szybkie generowanie szczegółowych planów podróży przy użyciu AI. Użytkownicy określają miejsce docelowe, czas trwania podróży, styl podróżowania i preferencje, a AI tworzy interaktywny plan z kartami dniowymi, mapami, szacowanymi kosztami i ciekawostkami historycznymi.

### Problem

Planowanie angażujących i interesujących wycieczek jest czasochłonne i wymaga dużej wiedzy oraz kreatywności. Użytkownicy często nie wiedzą, które atrakcje odwiedzić, gdzie zjeść lub jak zoptymalizować swój budżet. VibeTravels rozwiązuje ten problem, oferując zintegrowane narzędzie oparte na AI do szybkiego tworzenia spersonalizowanych planów podróży.

## Stos technologiczny

### Frontend
- Astro 5 - Do budowania szybkich, wydajnych stron i aplikacji z minimalną ilością JavaScript
- React 19 - Do komponentów interaktywnych
- TypeScript 5 - Do statycznego typowania i lepszego wsparcia IDE
- Tailwind 4 - Do stylizacji
- Shadcn/ui - Biblioteka dostępnych komponentów React

### Backend
- Supabase - Kompleksowe rozwiązanie backendowe zapewniające:
  - Bazę danych PostgreSQL
  - SDK dla Backend-as-a-Service
  - Wbudowaną autentykację użytkowników

### Integracja AI
- Openrouter.ai - Do komunikacji z różnymi modelami AI (OpenAI, Anthropic, Google itp.)

### CI/CD i Hosting
- GitHub Actions - Do pipeline'ów CI/CD
- DigitalOcean - Do hostowania za pośrednictwem obrazu Docker

## Uruchomienie lokalne

### Wymagania wstępne
- Node.js (zalecana najnowsza wersja LTS)
- Git

### Instalacja

1. Sklonuj repozytorium
```bash
git clone https://github.com/yourusername/travel-planner.git
cd travel-planner
```

2. Zainstaluj zależności
```bash
npm install
```

3. Uruchom serwer deweloperski
```bash
npm run dev
```

4. Otwórz przeglądarkę i przejdź do `http://localhost:4321`

## Dostępne skrypty

- `npm run dev` - Uruchomienie serwera deweloperskiego
- `npm run build` - Zbudowanie wersji produkcyjnej
- `npm run preview` - Podgląd wersji produkcyjnej lokalnie
- `npm run astro` - Uruchomienie poleceń Astro CLI
- `npm run lint` - Uruchomienie ESLint do sprawdzenia problemów
- `npm run lint:fix` - Uruchomienie ESLint i automatyczne naprawienie problemów
- `npm run format` - Uruchomienie Prettier do formatowania kodu

## Zakres projektu

### Funkcje zawarte
- System kont użytkowników (rejestracja, logowanie, reset hasła)
- Formularz podróży (miejsce docelowe, czas trwania, typ, preferencje)
- Plany podróży generowane przez AI (dzień po dniu: aktywności, restauracje, atrakcje)
- Widok planu z kartami dziennymi i interaktywną mapą
- Możliwość dodawania uwag do wygenerowanych planów
- Szacowanie kosztów (dziennych i całkowitych)
- Generowanie ciekawostek historycznych i lokalnych sekretów
- Rejestracja zdarzeń

### Funkcje niezawarte
- Udostępnianie planów między kontami
- Analiza multimediów (zdjęcia, filmy)
- Zaawansowana logistyka i planowanie czasowe
- Wersja mobilna i tryb offline
- Integracja ze źródłami zewnętrznymi innymi niż wybrany model AI

## Status projektu

Projekt jest obecnie w fazie rozwoju.

## Licencja

Licencja MIT
