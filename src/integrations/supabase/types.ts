export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      anomalies: {
        Row: {
          acknowledged: boolean | null
          acknowledged_at: string | null
          acknowledged_by: string | null
          details: string | null
          detected_at: string | null
          id: string
          metric_id: string | null
          resolved: boolean | null
          resolved_at: string | null
          severity: Database["public"]["Enums"]["severity_level"]
        }
        Insert: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          details?: string | null
          detected_at?: string | null
          id?: string
          metric_id?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["severity_level"]
        }
        Update: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          details?: string | null
          detected_at?: string | null
          id?: string
          metric_id?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["severity_level"]
        }
        Relationships: [
          {
            foreignKeyName: "anomalies_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "health_metrics"
            referencedColumns: ["id"]
          },
        ]
      }
      approvals: {
        Row: {
          assigned_to: string[]
          context_snapshot: Json | null
          created_at: string | null
          created_by: string
          due_at: string | null
          id: string
          revision_notes: string | null
          status: Database["public"]["Enums"]["approval_status"]
          title: string
          type: Database["public"]["Enums"]["approval_type"]
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string[]
          context_snapshot?: Json | null
          created_at?: string | null
          created_by: string
          due_at?: string | null
          id?: string
          revision_notes?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          title: string
          type: Database["public"]["Enums"]["approval_type"]
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string[]
          context_snapshot?: Json | null
          created_at?: string | null
          created_by?: string
          due_at?: string | null
          id?: string
          revision_notes?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          title?: string
          type?: Database["public"]["Enums"]["approval_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      bundles: {
        Row: {
          coherence: number | null
          created_at: string | null
          created_by: string
          geography: string[] | null
          id: string
          is_approved: boolean | null
          leverage_points: Json | null
          name: string
          ndi_impact: number | null
          objectives: string[] | null
          pillars: string[] | null
          status: Database["public"]["Enums"]["bundle_status"]
          summary: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          coherence?: number | null
          created_at?: string | null
          created_by: string
          geography?: string[] | null
          id?: string
          is_approved?: boolean | null
          leverage_points?: Json | null
          name: string
          ndi_impact?: number | null
          objectives?: string[] | null
          pillars?: string[] | null
          status?: Database["public"]["Enums"]["bundle_status"]
          summary?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          coherence?: number | null
          created_at?: string | null
          created_by?: string
          geography?: string[] | null
          id?: string
          is_approved?: boolean | null
          leverage_points?: Json | null
          name?: string
          ndi_impact?: number | null
          objectives?: string[] | null
          pillars?: string[] | null
          status?: Database["public"]["Enums"]["bundle_status"]
          summary?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      claims: {
        Row: {
          claimed_by: string | null
          closed_at: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          opened_at: string | null
          status: Database["public"]["Enums"]["claim_status"]
          task_id: string
          zone: Database["public"]["Enums"]["zone_name"]
        }
        Insert: {
          claimed_by?: string | null
          closed_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          status?: Database["public"]["Enums"]["claim_status"]
          task_id: string
          zone: Database["public"]["Enums"]["zone_name"]
        }
        Update: {
          claimed_by?: string | null
          closed_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          status?: Database["public"]["Enums"]["claim_status"]
          task_id?: string
          zone?: Database["public"]["Enums"]["zone_name"]
        }
        Relationships: []
      }
      cld_edges: {
        Row: {
          created_at: string | null
          id: string
          polarity: number
          scenario_id: string | null
          source_id: string | null
          strength: number | null
          target_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          polarity: number
          scenario_id?: string | null
          source_id?: string | null
          strength?: number | null
          target_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          polarity?: number
          scenario_id?: string | null
          source_id?: string | null
          strength?: number | null
          target_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cld_edges_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cld_edges_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "cld_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cld_edges_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "cld_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      cld_nodes: {
        Row: {
          created_at: string | null
          id: string
          label: string
          node_type: string | null
          position_x: number
          position_y: number
          scenario_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          node_type?: string | null
          position_x?: number
          position_y?: number
          scenario_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          node_type?: string | null
          position_x?: number
          position_y?: number
          scenario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cld_nodes_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      file_attachments: {
        Row: {
          content_type: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          file_key: string
          file_size: number | null
          id: string
          original_name: string
          uploaded_by: string
          url: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          file_key: string
          file_size?: number | null
          id?: string
          original_name: string
          uploaded_by: string
          url?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          file_key?: string
          file_size?: number | null
          id?: string
          original_name?: string
          uploaded_by?: string
          url?: string | null
        }
        Relationships: []
      }
      health_metrics: {
        Row: {
          created_at: string | null
          id: string
          name: string
          target: number | null
          timestamp: string | null
          value: number
          zone: Database["public"]["Enums"]["zone_name"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          target?: number | null
          timestamp?: string | null
          value: number
          zone: Database["public"]["Enums"]["zone_name"]
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          target?: number | null
          timestamp?: string | null
          value?: number
          zone?: Database["public"]["Enums"]["zone_name"]
        }
        Relationships: []
      }
      kpis: {
        Row: {
          bundle_id: string | null
          created_at: string | null
          current_value: number
          id: string
          name: string
          target_value: number
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          bundle_id?: string | null
          created_at?: string | null
          current_value?: number
          id?: string
          name: string
          target_value: number
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          bundle_id?: string | null
          created_at?: string | null
          current_value?: number
          id?: string
          name?: string
          target_value?: number
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kpis_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          archived_at: string | null
          content: string
          created_at: string | null
          created_by: string
          id: string
          source_bundle_id: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          archived_at?: string | null
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          source_bundle_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          archived_at?: string | null
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          source_bundle_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_source_bundle_id_fkey"
            columns: ["source_bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          preferences: Json | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          zone: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          zone?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          zone?: string | null
        }
        Relationships: []
      }
      scenarios: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_baseline: boolean | null
          name: string
          parameters: Json | null
          results: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_baseline?: boolean | null
          name: string
          parameters?: Json | null
          results?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_baseline?: boolean | null
          name?: string
          parameters?: Json | null
          results?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
    }
    Enums: {
      approval_status: "pending" | "approved" | "rejected" | "revisionRequested"
      approval_type: "strategy" | "bundle" | "redesign" | "externalDirective"
      bundle_status: "draft" | "active" | "pilot" | "completed"
      claim_status: "open" | "assigned" | "closed"
      severity_level: "low" | "medium" | "high"
      user_role: "director_general"
      zone_name: "THINK" | "ACT" | "LEARN" | "INNOVATE" | "MONITOR"
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
  public: {
    Enums: {
      approval_status: ["pending", "approved", "rejected", "revisionRequested"],
      approval_type: ["strategy", "bundle", "redesign", "externalDirective"],
      bundle_status: ["draft", "active", "pilot", "completed"],
      claim_status: ["open", "assigned", "closed"],
      severity_level: ["low", "medium", "high"],
      user_role: ["director_general"],
      zone_name: ["THINK", "ACT", "LEARN", "INNOVATE", "MONITOR"],
    },
  },
} as const
