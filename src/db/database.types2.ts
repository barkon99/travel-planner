/**
 * TypeScript definitions for VibeTravels database schema
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type TravelType = 'budget' | 'medium' | 'luxury'
export type LocationType = 'attraction' | 'restaurant' | 'activity'
export type EventType = 'registration' | 'login' | 'profile_update' | 'plan_creation' | 'plan_edit'

export interface Database {
  public: {
    Tables: {
      travel_plans: {
        Row: {
          id: string
          user_id: string
          destination: string
          duration_days: number
          travel_type: TravelType
          preferences: string[]
          places_to_visit: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          destination: string
          duration_days: number
          travel_type: TravelType
          preferences: string[]
          places_to_visit?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          destination?: string
          duration_days?: number
          travel_type?: TravelType
          preferences?: string[]
          places_to_visit?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      day_plans: {
        Row: {
          id: string
          travel_plan_id: string
          day_number: number
          summary: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          travel_plan_id: string
          day_number: number
          summary: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          travel_plan_id?: string
          day_number?: number
          summary?: string
          created_at?: string
          updated_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          day_plan_id: string
          name: string
          description: string
          type: LocationType
          latitude: number | null
          longitude: number | null
          cost: number | null
          time_needed: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          day_plan_id: string
          name: string
          description: string
          type: LocationType
          latitude?: number | null
          longitude?: number | null
          cost?: number | null
          time_needed?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          day_plan_id?: string
          name?: string
          description?: string
          type?: LocationType
          latitude?: number | null
          longitude?: number | null
          cost?: number | null
          time_needed?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      estimated_costs: {
        Row: {
          id: string
          day_plan_id: string
          accommodation: number
          transport: number
          food: number
          attractions: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          day_plan_id: string
          accommodation?: number
          transport?: number
          food?: number
          attractions?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          day_plan_id?: string
          accommodation?: number
          transport?: number
          food?: number
          attractions?: number
          created_at?: string
          updated_at?: string
        }
      }
      historical_facts: {
        Row: {
          id: string
          travel_plan_id: string
          place: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          travel_plan_id: string
          place: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          travel_plan_id?: string
          place?: string
          description?: string
          created_at?: string
        }
      }
      user_notes: {
        Row: {
          id: string
          travel_plan_id: string
          notes_text: string
          created_at: string
        }
        Insert: {
          id?: string
          travel_plan_id: string
          notes_text: string
          created_at?: string
        }
        Update: {
          id?: string
          travel_plan_id?: string
          notes_text?: string
          created_at?: string
        }
      }
      ai_responses: {
        Row: {
          id: string
          travel_plan_id: string
          response_text: string
          created_at: string
        }
        Insert: {
          id?: string
          travel_plan_id: string
          response_text: string
          created_at?: string
        }
        Update: {
          id?: string
          travel_plan_id?: string
          response_text?: string
          created_at?: string
        }
      }
      event_logs: {
        Row: {
          id: string
          user_id: string
          event_type: EventType
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_type: EventType
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: EventType
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_travel_plans: {
        Args: {
          user_id: string
        }
        Returns: {
          id: string
          user_id: string
          destination: string
          duration_days: number
          travel_type: TravelType
          preferences: string[]
          places_to_visit: string[] | null
          created_at: string
          updated_at: string
        }[]
      }
      get_complete_travel_plan: {
        Args: {
          travel_plan_id: string
        }
        Returns: Json
      }
      add_historical_fact: {
        Args: {
          p_travel_plan_id: string
          p_place: string
          p_description: string
        }
        Returns: string
      }
      log_user_event: {
        Args: {
          p_event_type: EventType
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types for accessing database tables and functions
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]

// Common types used throughout the application
export type TravelPlan = Tables<'travel_plans'>
export type DayPlan = Tables<'day_plans'>
export type Location = Tables<'locations'>
export type EstimatedCost = Tables<'estimated_costs'>
export type HistoricalFact = Tables<'historical_facts'>
export type UserNote = Tables<'user_notes'>
export type AIResponse = Tables<'ai_responses'>
export type EventLog = Tables<'event_logs'> 