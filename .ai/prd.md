# Dokument wymagań produktu (PRD) - VibeTravels

## 1. Przegląd produktu
VibeTravels to aplikacja webowa umożliwiająca użytkownikom szybkie generowanie szczegółowych planów podróży dzień po dniu z wykorzystaniem wybranego modelu AI. Użytkownicy określają kierunek, długość wycieczki, typ podróży oraz preferencje, a AI tworzy interaktywny plan z kartami dniowymi, mapą, szacowanymi kosztami i ciekawostkami historycznymi.

## 2. Problem użytkownika
Planowanie angażujących i interesujących wycieczek jest czasochłonne i wymaga dużego nakładu wiedzy oraz kreatywności. Użytkownicy często nie wiedzą, które atrakcje odwiedzić, gdzie zjeść czy jak zoptymalizować budżet, a brak zintegrowanego narzędzia zautomatyzowanego przez AI utrudnia szybkie tworzenie spersonalizowanych planów podróży.

## 3. Wymagania funkcjonalne
- RF-001 System kont
  - rejestracja (e-mail + hasło), logowanie, reset hasła
- RF-002 Formularz podróży
  - pola: kierunek, długość, typ (budżetowy/średni/luksusowy), preferencje (historia, przyroda, jedzenie, nocne życie, aktywność), miejsca do odzwiedzenia (opcjonalne)
- RF-003 Generacja planu przez AI
  - dzień po dniu (atrakcje, restauracje, aktywności)
- RF-004 Widok planu
  - karty na każdy dzień, interaktywna mapa z zaznaczonymi punktami
- RF-005 Dodawanie uwag do planu
  - możliwość dodania uwag do wygenerowanego planu 
- RF-006 Szacowanie kosztów
  - dzienne i całkowite przez AI
- RF-007 Ciekawostki historyczne i lokalne sekrety
  - generowane przez AI
- RF-08 Logowanie zdarzeń
  - rejestracja, uzupełnienie profilu, generowanie i edycja planu

## 4. Granice produktu
- nie obejmuje współdzielenia planów między kontami
- nie obejmuje analizy multimediów (zdjęć, wideo)
- nie obejmuje zaawansowanej logistyki i planowania czasowego
- brak wersji mobilnej i trybu offline
- integracja wyłącznie z wybranym modelem AI, bez innych źródeł zewnętrznych

## 5. Historyjki użytkowników
- ID: US-001  
  Tytuł: Rejestracja użytkownika  
  Opis: Użytkownik może zarejestrować konto przy użyciu adresu e-mail i hasła.  
  Kryteria akceptacji:  
    - Formularz rejestracyjny z polami e-mail i hasło jest dostępny.  
    - Po wprowadzeniu poprawnego e-maila i hasła konto zostaje utworzone i użytkownik jest zalogowany.  
    - Błędy walidacji dla niepoprawnego formatu e-mail lub zbyt słabego hasła są wyświetlane.  
    - Jeśli e-mail jest już zajęty, wyświetlany jest odpowiedni komunikat.

- ID: US-002  
  Tytuł: Logowanie użytkownika  
  Opis: Użytkownik może zalogować się przy użyciu zarejestrowanego e-maila i hasła.  
  Kryteria akceptacji:  
    - Formularz logowania z polami e-mail i hasło jest dostępny.  
    - Użytkownik zostaje zalogowany przy poprawnych danych.  
    - Przy niepoprawnych danych wyświetlany jest komunikat o błędnym logowaniu.

- ID: US-003  
  Tytuł: Resetowanie hasła  
  Opis: Użytkownik może zresetować hasło, podając swój adres e-mail.  
  Kryteria akceptacji:  
    - Formularz resetu hasła z polem e-mail jest dostępny.  
    - Po wprowadzeniu zarejestrowanego e-maila wysłany jest link/reset token.  
    - Przy nieistniejącym e-mailu wyświetlany jest odpowiedni komunikat.

- ID: US-004  
  Tytuł: Wypełnienie formularza podróży  
  Opis: Zalogowany użytkownik wypełnia formularz z parametrami podróży.  
  Kryteria akceptacji:  
    - Formularz zawiera pola: kierunek, długość, typ, preferencje i opcjonalne punkty zainteresowania.  
    - Wszystkie wymagane pola muszą być wypełnione przed wysłaniem.  
    - Błędy walidacji są wyświetlane dla brakujących lub nieprawidłowych danych.

- ID: US-005  
  Tytuł: Generacja planu przez AI  
  Opis: Po wysłaniu formularza system generuje plan dzień po dniu z AI.  
  Kryteria akceptacji:  
    - Użytkownik widzi informację o trwającej generacji.  
    - Po zakończeniu generacji wyświetla się plan z kartami dniowymi i mapą.  
    - W przypadku błędu AI wyświetlany jest komunikat i opcja ponowienia próby.

- ID: US-006  
  Tytuł: Podgląd i interakcja z planem  
  Opis: Użytkownik przegląda wygenerowany plan w formie kart i mapy.  
  Kryteria akceptacji:  
    - Plan wyświetla atrakcje, restauracje oraz wskazówki.  
    - Interaktywna mapa pokazuje punkty z planu.  
    - Użytkownik może powiększać/zmniejszać mapę i kliknąć punkty.

- ID: US-007  
  Tytuł: Edycja planu  
  Opis: Użytkownik może dodać uwagi do wygenerowanego planu   
  Kryteria akceptacji:
    - Pole tesktowe które użytkwonik będzie mół uzupełnić w przypadku chęci zmodyfikowania planu np. usunięcie lub dodanie nowych punktów  
    - Po wypełnieniu pola tekstowego i kliknięciu przycisku AI modyfikuje plan

- ID: US-008  
  Tytuł: Zapisywanie planu  
  Opis: Użytkownik może zapisać wygenerowany lub edytowany plan do swojego konta.  
  Kryteria akceptacji:  
    - Przyciski zapisu są dostępne przy planie.  
    - Plan zostaje zapisany pod profilem użytkownika.  
    - Użytkownik otrzymuje potwierdzenie zapisu.

- ID: US-009  
  Tytuł: Przeglądanie zapisanych planów  
  Opis: Użytkownik może przeglądać listę swoich zapisanych planów.  
  Kryteria akceptacji:  
    - Lista planów zawiera tytuł, datę utworzenia i przyciski podglądu.  
    - Kliknięcie przenosi do szczegółowego widoku planu.  
    - Jeśli brak planów, wyświetlany jest komunikat zachęcający do utworzenia nowego.

## 6. Metryki sukcesu
- liczba zarejestrowanych użytkowników (cel: X)  
- liczba wygenerowanych planów podróży (cel: Y)  
- liczba ponownych odsłon zapisanych planów  
- wskaźnik błędów generacji AI (%)  
- wskaźnik aktywnych użytkowników dziennie (DAU)  