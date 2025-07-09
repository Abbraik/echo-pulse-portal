export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
          origin_entity_id: string
          origin_zone: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
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
          origin_entity_id?: string
          origin_zone?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
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
          origin_entity_id?: string
          origin_zone?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
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
      coherence_scores: {
        Row: {
          bundle_id: string
          created_at: string | null
          leverage_point: string
          objective: string
          score: number | null
          updated_at: string | null
        }
        Insert: {
          bundle_id: string
          created_at?: string | null
          leverage_point: string
          objective: string
          score?: number | null
          updated_at?: string | null
        }
        Update: {
          bundle_id?: string
          created_at?: string | null
          leverage_point?: string
          objective?: string
          score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coherence_scores_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
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
      leverage_points_reference: {
        Row: {
          created_at: string | null
          current_usage: number | null
          description: string
          id: string
          name: string
          recommended: boolean | null
        }
        Insert: {
          created_at?: string | null
          current_usage?: number | null
          description: string
          id: string
          name: string
          recommended?: boolean | null
        }
        Update: {
          created_at?: string | null
          current_usage?: number | null
          description?: string
          id?: string
          name?: string
          recommended?: boolean | null
        }
        Relationships: []
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
      tasks: {
        Row: {
          assignee: string
          assignee_avatar: string | null
          assignee_initial: string | null
          bundle_id: string | null
          created_at: string
          created_by: string | null
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          gantt_duration: number | null
          gantt_start: number | null
          id: string
          needs_approval: boolean
          status: string
          teams_chat_history: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          assignee: string
          assignee_avatar?: string | null
          assignee_initial?: string | null
          bundle_id?: string | null
          created_at?: string
          created_by?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          gantt_duration?: number | null
          gantt_start?: number | null
          id?: string
          needs_approval?: boolean
          status?: string
          teams_chat_history?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          assignee?: string
          assignee_avatar?: string | null
          assignee_initial?: string | null
          bundle_id?: string | null
          created_at?: string
          created_by?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          gantt_duration?: number | null
          gantt_start?: number | null
          id?: string
          needs_approval?: boolean
          status?: string
          teams_chat_history?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
        ]
      }
      ui_content: {
        Row: {
          category: string | null
          component: string | null
          created_at: string
          description: string | null
          id: string
          key: string
          page: string | null
          updated_at: string
          value: string
        }
        Insert: {
          category?: string | null
          component?: string | null
          created_at?: string
          description?: string | null
          id?: string
          key: string
          page?: string | null
          updated_at?: string
          value: string
        }
        Update: {
          category?: string | null
          component?: string | null
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          page?: string | null
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_task: {
        Args: { claim_id: string }
        Returns: undefined
      }
      get_coherence_matrix: {
        Args: { bundle_id: string }
        Returns: Json
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_leverage_points: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      release_task: {
        Args: { claim_id: string }
        Returns: undefined
      }
      resolve_task: {
        Args: { claim_id: string; notes?: string }
        Returns: undefined
      }
      update_bundle_leverage: {
        Args:
          | { bundle_id: string; point: string }
          | { bundle_id: string; points: string[] }
        Returns: undefined
      }
      update_coherence_score: {
        Args: {
          bundle_id: string
          objective: string
          leverage_point: string
          new_score: number
        }
        Returns: undefined
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
