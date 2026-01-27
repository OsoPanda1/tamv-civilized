export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      dreamspaces: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          owner_id: string
          scene_config: Json | null
          scene_type: string
          title: string
          updated_at: string
          visitors: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          owner_id: string
          scene_config?: Json | null
          scene_type?: string
          title: string
          updated_at?: string
          visitors?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          owner_id?: string
          scene_config?: Json | null
          scene_type?: string
          title?: string
          updated_at?: string
          visitors?: number | null
        }
        Relationships: []
      }
      isabella_conversations: {
        Row: {
          created_at: string
          emotional_state: Json | null
          id: string
          memory_level: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emotional_state?: Json | null
          id?: string
          memory_level?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emotional_state?: Json | null
          id?: string
          memory_level?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      isabella_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          emotional_state: Json | null
          id: string
          msr_event_id: string | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          emotional_state?: Json | null
          id?: string
          msr_event_id?: string | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          emotional_state?: Json | null
          id?: string
          msr_event_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "isabella_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "isabella_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      msr_events: {
        Row: {
          actor_id: string | null
          constitution_version: string | null
          created_at: string
          event_type: string
          id: string
          parent_hash: string | null
          payload: Json
          payload_hash: string
          signature: string | null
        }
        Insert: {
          actor_id?: string | null
          constitution_version?: string | null
          created_at?: string
          event_type: string
          id?: string
          parent_hash?: string | null
          payload: Json
          payload_hash: string
          signature?: string | null
        }
        Update: {
          actor_id?: string | null
          constitution_version?: string | null
          created_at?: string
          event_type?: string
          id?: string
          parent_hash?: string | null
          payload?: Json
          payload_hash?: string
          signature?: string | null
        }
        Relationships: []
      }
      nubi_transactions: {
        Row: {
          amount: number
          created_at: string
          creator_amount: number | null
          description: string | null
          fenix_amount: number | null
          id: string
          metadata: Json | null
          reference_id: string | null
          split_type: Database["public"]["Enums"]["transaction_split_type"]
          status: Database["public"]["Enums"]["transaction_status"]
          type: string
          vault_amount: number | null
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          creator_amount?: number | null
          description?: string | null
          fenix_amount?: number | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          split_type?: Database["public"]["Enums"]["transaction_split_type"]
          status?: Database["public"]["Enums"]["transaction_status"]
          type: string
          vault_amount?: number | null
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          creator_amount?: number | null
          description?: string | null
          fenix_amount?: number | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          split_type?: Database["public"]["Enums"]["transaction_split_type"]
          status?: Database["public"]["Enums"]["transaction_status"]
          type?: string
          vault_amount?: number | null
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nubi_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "nubi_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      nubi_wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          locked_balance: number
          total_earned: number
          total_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          locked_balance?: number
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          locked_balance?: number
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          did: string
          display_name: string
          id: string
          karma_score: number
          msr_reputation: number
          tier: Database["public"]["Enums"]["membership_tier"]
          updated_at: string
          user_id: string
          wallet_balance: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          did?: string
          display_name: string
          id?: string
          karma_score?: number
          msr_reputation?: number
          tier?: Database["public"]["Enums"]["membership_tier"]
          updated_at?: string
          user_id: string
          wallet_balance?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          did?: string
          display_name?: string
          id?: string
          karma_score?: number
          msr_reputation?: number
          tier?: Database["public"]["Enums"]["membership_tier"]
          updated_at?: string
          user_id?: string
          wallet_balance?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      membership_tier: "citizen" | "architect" | "guardian" | "celestial"
      transaction_split_type:
        | "quantum_70_25"
        | "quantum_50_50"
        | "standard"
        | "gift"
        | "withdrawal"
      transaction_status:
        | "pending"
        | "completed"
        | "failed"
        | "cancelled"
        | "locked"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      membership_tier: ["citizen", "architect", "guardian", "celestial"],
      transaction_split_type: [
        "quantum_70_25",
        "quantum_50_50",
        "standard",
        "gift",
        "withdrawal",
      ],
      transaction_status: [
        "pending",
        "completed",
        "failed",
        "cancelled",
        "locked",
      ],
    },
  },
} as const
