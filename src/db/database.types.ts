export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_responses: {
        Row: {
          created_at: string
          id: string
          response_text: string
          travel_plan_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          response_text: string
          travel_plan_id: string
        }
        Update: {
          created_at?: string
          id?: string
          response_text?: string
          travel_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_responses_travel_plan_id_fkey"
            columns: ["travel_plan_id"]
            isOneToOne: false
            referencedRelation: "travel_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      day_plans: {
        Row: {
          created_at: string
          day_number: number
          id: string
          summary: string
          travel_plan_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_number: number
          id?: string
          summary: string
          travel_plan_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_number?: number
          id?: string
          summary?: string
          travel_plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "day_plans_travel_plan_id_fkey"
            columns: ["travel_plan_id"]
            isOneToOne: false
            referencedRelation: "travel_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      estimated_costs: {
        Row: {
          accommodation: number
          attractions: number
          created_at: string
          day_plan_id: string
          food: number
          id: string
          transport: number
          updated_at: string
        }
        Insert: {
          accommodation?: number
          attractions?: number
          created_at?: string
          day_plan_id: string
          food?: number
          id?: string
          transport?: number
          updated_at?: string
        }
        Update: {
          accommodation?: number
          attractions?: number
          created_at?: string
          day_plan_id?: string
          food?: number
          id?: string
          transport?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "estimated_costs_day_plan_id_fkey"
            columns: ["day_plan_id"]
            isOneToOne: true
            referencedRelation: "day_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      event_logs: {
        Row: {
          created_at: string
          event_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      historical_facts: {
        Row: {
          created_at: string
          description: string
          id: string
          place: string
          travel_plan_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          place: string
          travel_plan_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          place?: string
          travel_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "historical_facts_travel_plan_id_fkey"
            columns: ["travel_plan_id"]
            isOneToOne: false
            referencedRelation: "travel_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          cost: number | null
          created_at: string
          day_plan_id: string
          description: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          time_needed: number | null
          type: string
          updated_at: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          day_plan_id: string
          description: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          time_needed?: number | null
          type: string
          updated_at?: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          day_plan_id?: string
          description?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          time_needed?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_day_plan_id_fkey"
            columns: ["day_plan_id"]
            isOneToOne: false
            referencedRelation: "day_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_plans: {
        Row: {
          created_at: string
          destination: string
          duration_days: number
          id: string
          places_to_visit: string[] | null
          preferences: string[]
          travel_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          destination: string
          duration_days: number
          id?: string
          places_to_visit?: string[] | null
          preferences: string[]
          travel_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          destination?: string
          duration_days?: number
          id?: string
          places_to_visit?: string[] | null
          preferences?: string[]
          travel_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notes: {
        Row: {
          created_at: string
          id: string
          notes_text: string
          travel_plan_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes_text: string
          travel_plan_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes_text?: string
          travel_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notes_travel_plan_id_fkey"
            columns: ["travel_plan_id"]
            isOneToOne: false
            referencedRelation: "travel_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_historical_fact: {
        Args: {
          p_travel_plan_id: string
          p_place: string
          p_description: string
        }
        Returns: string
      }
      get_complete_travel_plan: {
        Args: { travel_plan_id: string }
        Returns: Json
      }
      get_user_travel_plans: {
        Args: { user_id: string }
        Returns: {
          created_at: string
          destination: string
          duration_days: number
          id: string
          places_to_visit: string[] | null
          preferences: string[]
          travel_type: string
          updated_at: string
          user_id: string
        }[]
      }
      log_user_event: {
        Args: { p_event_type: string }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

