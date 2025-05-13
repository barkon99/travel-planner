import type { GenerationStatus } from "../../types";

// Model planu podróży z mockowanych danych
export interface TravelPlanMock {
  id: string;
  user_id: string;
  destination: string;
  duration_days: number;
  travel_type: string;
  preferences: string[];
  places_to_visit: string[] | null;
  generation_status: GenerationStatus;
  created_at: string;
  updated_at: string;
}

// Typ zwracany przez metodę single()
export interface SingleResponse<T> {
  data: T | null;
  error: string | null;
}

// Typ zwracany przez metodę select() z count
export interface CountResponse {
  count: number;
  error: string | null;
}

// Typ zwracany przez metody insert() i update()
export interface MutationResponse {
  error: string | null;
}

// Zwracany przez metody .select()
export type SelectMethodReturnType<T> = {
  eq: (column: string, value: any) => {
    eq: (column2: string, value2: any) => {
      single: () => Promise<SingleResponse<T>>;
    };
  };
};

// Zwracany przez .from("generation_queue").select()
export type QueueSelectMethodReturnType = {
  eq: (column: string, value: any) => {
    eq: (column2: string, value2: any) => Promise<CountResponse>;
  };
};

// Zwracany przez .from("table")
export type TableMethodsReturnType<T> = {
  select: (columns?: string, options?: any) => SelectMethodReturnType<T> | QueueSelectMethodReturnType;
  insert: (data: any) => Promise<MutationResponse>;
  update: (data: any) => {
    eq: (column: string, value: any) => Promise<MutationResponse>;
  };
};

// Tymczasowa implementacja supabaseServer - w rzeczywistości będzie zaimportowana
export function supabaseMock(locals: any) {
  const mockTravelPlan = (id: string, userId: string, requestPath?: string): TravelPlanMock => {
    // Jeśli URL ścieżki zawiera "generate" lub "generation-status", losujemy status
    // W przeciwnym razie zawsze zwracamy "completed" aby ułatwić testowanie pobierania planu
    let mockStatus: GenerationStatus;
    
    if (requestPath && (requestPath.includes("generate") || requestPath.includes("generation-status"))) {
      // Losowo wybieramy status generacji dla endpointów generowania/statusu
      const statuses: GenerationStatus[] = ["pending", "completed", "failed"];
      mockStatus = statuses[Math.floor(Math.random() * 3)];
    } else {
      // Dla bezpośredniego pobierania planu zawsze zwracamy "completed"
      mockStatus = "completed";
    }

    return {
      id,
      user_id: userId,
      destination: 'Warszawa',
      duration_days: 3,
      travel_type: 'medium',
      preferences: ['culture', 'food'],
      places_to_visit: ['Pałac Kultury', 'Łazienki'],
      generation_status: mockStatus,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  };
  
  return {
    from: (table: string): any => {
      // Mock dla tabeli travel_plans
      if (table === 'travel_plans') {
        return {
          select: (columns: string = '*') => ({
            eq: (column: string, value: any) => ({
              eq: (column2: string, value2: any) => ({
                single: (): Promise<SingleResponse<TravelPlanMock>> => {
                  // Pobieramy URL ścieżki z obiektu request, jeśli jest dostępny
                  const requestPath = locals?.request?.url || "";
                  
                  return Promise.resolve({
                    data: mockTravelPlan(value, value2, requestPath),
                    error: null
                  });
                }
              })
            })
          }),
          update: (data: any) => ({
            eq: (column: string, value: any): Promise<MutationResponse> => 
              Promise.resolve({ error: null })
          }),
          insert: (data: any): Promise<MutationResponse> => 
            Promise.resolve({ error: null })
        };
      }

      // Mock dla tabeli generation_queue - traktujemy specjalnie
      if (table === 'generation_queue') {
        const queueMock = {
          insert: (data: any): Promise<MutationResponse> => 
            Promise.resolve({ error: null }),
          select: (columns: string = '*', options: any = {}): QueueSelectMethodReturnType => ({
            eq: (column: string, value: any) => ({
              eq: (column2: string, value2: any): Promise<CountResponse> => 
                Promise.resolve({
                  count: 2,
                  error: null
                })
            })
          })
        };
        return queueMock;
      }

      // Domyślny mock dla innych tabel
      return {
        insert: (data: any): Promise<MutationResponse> => 
          Promise.resolve({ error: null }),
        select: (): SelectMethodReturnType<null> => ({
          eq: () => ({
            eq: () => ({
              single: (): Promise<SingleResponse<null>> => 
                Promise.resolve({ data: null, error: "Not found" })
            })
          })
        }),
        update: (data: any) => ({
          eq: (): Promise<MutationResponse> => 
            Promise.resolve({ error: null })
        })
      };
    }
  };
} 