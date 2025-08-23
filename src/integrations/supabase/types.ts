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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_post_categories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          post_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          post_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          excerpt: string | null
          featured_image_alt: string | null
          featured_image_url: string | null
          id: string
          link_location: string
          meta_description: string | null
          meta_title: string | null
          priority: string | null
          published_at: string | null
          reading_time: number | null
          slug: string
          sort_order: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_alt?: string | null
          featured_image_url?: string | null
          id?: string
          link_location?: string
          meta_description?: string | null
          meta_title?: string | null
          priority?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          sort_order?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_alt?: string | null
          featured_image_url?: string | null
          id?: string
          link_location?: string
          meta_description?: string | null
          meta_title?: string | null
          priority?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string
          sort_order?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      feature_request_comments: {
        Row: {
          author_name: string
          content: string
          created_at: string
          feature_request_id: string
          id: string
          parent_comment_id: string | null
          updated_at: string
          user_id: string
          votes: number
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string
          feature_request_id: string
          id?: string
          parent_comment_id?: string | null
          updated_at?: string
          user_id: string
          votes?: number
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          feature_request_id?: string
          id?: string
          parent_comment_id?: string | null
          updated_at?: string
          user_id?: string
          votes?: number
        }
        Relationships: [
          {
            foreignKeyName: "feature_request_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "feature_request_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_feature_request_comments_feature_request_id"
            columns: ["feature_request_id"]
            isOneToOne: false
            referencedRelation: "feature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_request_surveys: {
        Row: {
          created_at: string
          feature_request_id: string
          frequency: number
          id: string
          importance: number
          timing: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_request_id: string
          frequency: number
          id?: string
          importance: number
          timing: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feature_request_id?: string
          frequency?: number
          id?: string
          importance?: number
          timing?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_feature_request_surveys_feature_request_id"
            columns: ["feature_request_id"]
            isOneToOne: false
            referencedRelation: "feature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_request_votes: {
        Row: {
          created_at: string
          feature_request_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_request_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feature_request_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_request_votes_feature_request_id_fkey"
            columns: ["feature_request_id"]
            isOneToOne: false
            referencedRelation: "feature_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_feature_request_votes_feature_request_id"
            columns: ["feature_request_id"]
            isOneToOne: false
            referencedRelation: "feature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_requests: {
        Row: {
          author_id: string
          author_name: string
          category: Database["public"]["Enums"]["feature_request_category"]
          created_at: string
          description: string | null
          id: string
          title: string
          updated_at: string
          votes: number
        }
        Insert: {
          author_id: string
          author_name: string
          category?: Database["public"]["Enums"]["feature_request_category"]
          created_at?: string
          description?: string | null
          id?: string
          title: string
          updated_at?: string
          votes?: number
        }
        Update: {
          author_id?: string
          author_name?: string
          category?: Database["public"]["Enums"]["feature_request_category"]
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
          votes?: number
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          subscription_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          subscription_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          subscription_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      pilot_applications: {
        Row: {
          business_types: string[] | null
          company: string
          created_at: string
          email: string
          help: string | null
          id: string
          name: string
          phone: string | null
          preferred_contact: string | null
          role: string
          updated_at: string
          website: string | null
        }
        Insert: {
          business_types?: string[] | null
          company: string
          created_at?: string
          email: string
          help?: string | null
          id?: string
          name: string
          phone?: string | null
          preferred_contact?: string | null
          role: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          business_types?: string[] | null
          company?: string
          created_at?: string
          email?: string
          help?: string | null
          id?: string
          name?: string
          phone?: string | null
          preferred_contact?: string | null
          role?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      use_case_videos: {
        Row: {
          client_name: string | null
          client_role: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          sort_order: number | null
          title: string
          updated_at: string
          vimeo_url: string
        }
        Insert: {
          client_name?: string | null
          client_role?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number | null
          title: string
          updated_at?: string
          vimeo_url: string
        }
        Update: {
          client_name?: string | null
          client_role?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number | null
          title?: string
          updated_at?: string
          vimeo_url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_safe_profile_data: {
        Args: { profile_user_id: string }
        Returns: {
          created_at: string
          display_name: string
          id: string
          updated_at: string
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      make_user_admin: {
        Args: { user_email: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
      feature_request_category:
        | "feedback"
        | "feature-request"
        | "integrations"
        | "questions"
        | "bug-hunting"
        | "lovable-project"
        | "ama"
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
      app_role: ["admin", "user"],
      feature_request_category: [
        "feedback",
        "feature-request",
        "integrations",
        "questions",
        "bug-hunting",
        "lovable-project",
        "ama",
      ],
    },
  },
} as const
