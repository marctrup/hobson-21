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
      chatbot_knowledge_base: {
        Row: {
          content: string
          id: string
          last_updated: string | null
          version: number | null
        }
        Insert: {
          content: string
          id?: string
          last_updated?: string | null
          version?: number | null
        }
        Update: {
          content?: string
          id?: string
          last_updated?: string | null
          version?: number | null
        }
        Relationships: []
      }
      communication_attachments: {
        Row: {
          communication_id: string
          created_at: string
          file_name: string
          id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          communication_id: string
          created_at?: string
          file_name: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          communication_id?: string
          created_at?: string
          file_name?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_attachments_communication_id_fkey"
            columns: ["communication_id"]
            isOneToOne: false
            referencedRelation: "communications"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_participants: {
        Row: {
          communication_id: string
          contact_id: string | null
          created_at: string
          external_email: string | null
          external_name: string | null
          id: string
          kind: Database["public"]["Enums"]["participant_kind"]
          platform_user_id: string | null
          role_in_comm: Database["public"]["Enums"]["participant_role"]
          workspace_member_id: string | null
        }
        Insert: {
          communication_id: string
          contact_id?: string | null
          created_at?: string
          external_email?: string | null
          external_name?: string | null
          id?: string
          kind: Database["public"]["Enums"]["participant_kind"]
          platform_user_id?: string | null
          role_in_comm: Database["public"]["Enums"]["participant_role"]
          workspace_member_id?: string | null
        }
        Update: {
          communication_id?: string
          contact_id?: string | null
          created_at?: string
          external_email?: string | null
          external_name?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["participant_kind"]
          platform_user_id?: string | null
          role_in_comm?: Database["public"]["Enums"]["participant_role"]
          workspace_member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_participants_communication_id_fkey"
            columns: ["communication_id"]
            isOneToOne: false
            referencedRelation: "communications"
            referencedColumns: ["id"]
          },
        ]
      }
      communications: {
        Row: {
          body_html: string | null
          body_plain: string | null
          call_duration_seconds: number | null
          channel: Database["public"]["Enums"]["comm_channel"]
          client_id: string
          created_at: string
          direction: Database["public"]["Enums"]["comm_direction"]
          email_cc: string[] | null
          email_from: string | null
          email_message_id: string | null
          email_to: string[] | null
          fts: unknown
          id: string
          is_important: boolean
          linked_task_id: string | null
          logged_by: string | null
          meeting_location: string | null
          needs_review: boolean
          occurred_at: string
          pending_follow_up_note: string | null
          sentiment: Database["public"]["Enums"]["comm_sentiment"] | null
          subject: string | null
          summary: string | null
          updated_at: string
        }
        Insert: {
          body_html?: string | null
          body_plain?: string | null
          call_duration_seconds?: number | null
          channel: Database["public"]["Enums"]["comm_channel"]
          client_id: string
          created_at?: string
          direction: Database["public"]["Enums"]["comm_direction"]
          email_cc?: string[] | null
          email_from?: string | null
          email_message_id?: string | null
          email_to?: string[] | null
          fts?: unknown
          id?: string
          is_important?: boolean
          linked_task_id?: string | null
          logged_by?: string | null
          meeting_location?: string | null
          needs_review?: boolean
          occurred_at: string
          pending_follow_up_note?: string | null
          sentiment?: Database["public"]["Enums"]["comm_sentiment"] | null
          subject?: string | null
          summary?: string | null
          updated_at?: string
        }
        Update: {
          body_html?: string | null
          body_plain?: string | null
          call_duration_seconds?: number | null
          channel?: Database["public"]["Enums"]["comm_channel"]
          client_id?: string
          created_at?: string
          direction?: Database["public"]["Enums"]["comm_direction"]
          email_cc?: string[] | null
          email_from?: string | null
          email_message_id?: string | null
          email_to?: string[] | null
          fts?: unknown
          id?: string
          is_important?: boolean
          linked_task_id?: string | null
          logged_by?: string | null
          meeting_location?: string | null
          needs_review?: boolean
          occurred_at?: string
          pending_follow_up_note?: string | null
          sentiment?: Database["public"]["Enums"]["comm_sentiment"] | null
          subject?: string | null
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
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
      contact_messages_encrypted: {
        Row: {
          created_at: string
          email_encrypted: string | null
          email_hash: string | null
          id: string
          message_encrypted: string | null
          name_encrypted: string | null
          phone_encrypted: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email_encrypted?: string | null
          email_hash?: string | null
          id?: string
          message_encrypted?: string | null
          name_encrypted?: string | null
          phone_encrypted?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email_encrypted?: string | null
          email_hash?: string | null
          id?: string
          message_encrypted?: string | null
          name_encrypted?: string | null
          phone_encrypted?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      crm_activity_log: {
        Row: {
          action_type: string
          client_id: string | null
          created_at: string
          description: string | null
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          client_id?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          client_id?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_activity_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_client_users: {
        Row: {
          client_id: string
          created_at: string
          department: string | null
          email: string
          first_seen_at: string | null
          full_name: string
          id: string
          is_primary_admin: boolean
          job_title: string | null
          last_active_at: string | null
          linkedin_url: string | null
          notes: string | null
          phone: string | null
          platform_role: string
          platform_user_id: string | null
          seniority_level: string | null
          status: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          department?: string | null
          email: string
          first_seen_at?: string | null
          full_name: string
          id?: string
          is_primary_admin?: boolean
          job_title?: string | null
          last_active_at?: string | null
          linkedin_url?: string | null
          notes?: string | null
          phone?: string | null
          platform_role?: string
          platform_user_id?: string | null
          seniority_level?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          department?: string | null
          email?: string
          first_seen_at?: string | null
          full_name?: string
          id?: string
          is_primary_admin?: boolean
          job_title?: string | null
          last_active_at?: string | null
          linkedin_url?: string | null
          notes?: string | null
          phone?: string | null
          platform_role?: string
          platform_user_id?: string | null
          seniority_level?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_client_users_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_clients: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          annual_revenue_band: string | null
          billing_cycle: string | null
          city: string | null
          client_type: string
          compliance_focus: string[] | null
          contract_end_date: string | null
          contract_start_date: string | null
          contracted_monthly_value_gbp: number | null
          country: string | null
          created_at: string
          created_by: string | null
          email: string | null
          estimated_annual_property_spend_gbp: number | null
          estimated_deal_value_gbp: number | null
          expected_close_date: string | null
          first_contact_date: string | null
          form_source: string | null
          geographic_spread: string[] | null
          id: string
          interest_level: string
          last_contact_date: string | null
          lead_source: string | null
          lead_source_detail: string | null
          licensed_user_seats: number | null
          linkedin_url: string | null
          name: string
          next_action: string | null
          next_action_date: string | null
          open_issues_count: number
          open_tasks_count: number
          origin_metadata: Json | null
          owner_id: string | null
          phone: string | null
          pipeline_stage: string
          postcode: string | null
          primary_admin_user_id: string | null
          primary_contact_email: string | null
          primary_contact_name: string | null
          primary_contact_phone: string | null
          primary_contact_role: string | null
          priority: string
          probability_to_close: number | null
          property_count: number | null
          segment: string
          staff_size_band: string | null
          status: string
          sub_sector: string | null
          subscription_plan: string | null
          subscription_status: string | null
          tags: string[] | null
          tech_stack: string[] | null
          tenure_mix: string | null
          total_floor_area_sqft: number | null
          upcoming_lease_events_12m: number | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          annual_revenue_band?: string | null
          billing_cycle?: string | null
          city?: string | null
          client_type?: string
          compliance_focus?: string[] | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          contracted_monthly_value_gbp?: number | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          estimated_annual_property_spend_gbp?: number | null
          estimated_deal_value_gbp?: number | null
          expected_close_date?: string | null
          first_contact_date?: string | null
          form_source?: string | null
          geographic_spread?: string[] | null
          id?: string
          interest_level?: string
          last_contact_date?: string | null
          lead_source?: string | null
          lead_source_detail?: string | null
          licensed_user_seats?: number | null
          linkedin_url?: string | null
          name: string
          next_action?: string | null
          next_action_date?: string | null
          open_issues_count?: number
          open_tasks_count?: number
          origin_metadata?: Json | null
          owner_id?: string | null
          phone?: string | null
          pipeline_stage?: string
          postcode?: string | null
          primary_admin_user_id?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          primary_contact_role?: string | null
          priority?: string
          probability_to_close?: number | null
          property_count?: number | null
          segment?: string
          staff_size_band?: string | null
          status?: string
          sub_sector?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          tags?: string[] | null
          tech_stack?: string[] | null
          tenure_mix?: string | null
          total_floor_area_sqft?: number | null
          upcoming_lease_events_12m?: number | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          annual_revenue_band?: string | null
          billing_cycle?: string | null
          city?: string | null
          client_type?: string
          compliance_focus?: string[] | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          contracted_monthly_value_gbp?: number | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          estimated_annual_property_spend_gbp?: number | null
          estimated_deal_value_gbp?: number | null
          expected_close_date?: string | null
          first_contact_date?: string | null
          form_source?: string | null
          geographic_spread?: string[] | null
          id?: string
          interest_level?: string
          last_contact_date?: string | null
          lead_source?: string | null
          lead_source_detail?: string | null
          licensed_user_seats?: number | null
          linkedin_url?: string | null
          name?: string
          next_action?: string | null
          next_action_date?: string | null
          open_issues_count?: number
          open_tasks_count?: number
          origin_metadata?: Json | null
          owner_id?: string | null
          phone?: string | null
          pipeline_stage?: string
          postcode?: string | null
          primary_admin_user_id?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          primary_contact_role?: string | null
          priority?: string
          probability_to_close?: number | null
          property_count?: number | null
          segment?: string
          staff_size_band?: string | null
          status?: string
          sub_sector?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          tags?: string[] | null
          tech_stack?: string[] | null
          tenure_mix?: string | null
          total_floor_area_sqft?: number | null
          upcoming_lease_events_12m?: number | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_clients_primary_admin_fk"
            columns: ["primary_admin_user_id"]
            isOneToOne: false
            referencedRelation: "crm_client_users"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          client_id: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_primary: boolean
          job_title: string | null
          linkedin_url: string | null
          notes: string | null
          phone: string | null
          role_description: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_primary?: boolean
          job_title?: string | null
          linkedin_url?: string | null
          notes?: string | null
          phone?: string | null
          role_description?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_primary?: boolean
          job_title?: string | null
          linkedin_url?: string | null
          notes?: string | null
          phone?: string | null
          role_description?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_idempotency_keys: {
        Row: {
          created_at: string
          key: string
          result: Json | null
          scope: string
        }
        Insert: {
          created_at?: string
          key: string
          result?: Json | null
          scope: string
        }
        Update: {
          created_at?: string
          key?: string
          result?: Json | null
          scope?: string
        }
        Relationships: []
      }
      crm_ingest_failures: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          payload: Json
          resolved_at: string | null
          retry_count: number
          source: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          payload: Json
          resolved_at?: string | null
          retry_count?: number
          source: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          payload?: Json
          resolved_at?: string | null
          retry_count?: number
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["app_role"]
          status: string
          token_hash: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role: Database["public"]["Enums"]["app_role"]
          status?: string
          token_hash: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
          token_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_issue_comments: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          id: string
          is_status_change: boolean
          issue_id: string
          metadata: Json | null
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          id?: string
          is_status_change?: boolean
          issue_id: string
          metadata?: Json | null
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          id?: string
          is_status_change?: boolean
          issue_id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      crm_issues: {
        Row: {
          assignee_id: string | null
          category: Database["public"]["Enums"]["issue_category"]
          client_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["issue_priority"]
          reported_by: string | null
          reported_via_communication_id: string | null
          resolution_note: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["issue_status"]
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          category?: Database["public"]["Enums"]["issue_category"]
          client_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["issue_priority"]
          reported_by?: string | null
          reported_via_communication_id?: string | null
          resolution_note?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["issue_status"]
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          category?: Database["public"]["Enums"]["issue_category"]
          client_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["issue_priority"]
          reported_by?: string | null
          reported_via_communication_id?: string | null
          resolution_note?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["issue_status"]
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_notes: {
        Row: {
          client_id: string
          content: string
          created_at: string
          created_by: string | null
          id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_pipeline_stages: {
        Row: {
          color: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          is_terminal: boolean
          key: string
          label: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          display_order: number
          id?: string
          is_active?: boolean
          is_terminal?: boolean
          key: string
          label: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_terminal?: boolean
          key?: string
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_tasks: {
        Row: {
          assignee_id: string | null
          client_id: string | null
          completed_at: string | null
          created_at: string
          created_by: string
          due_date: string | null
          id: string
          linked_issue_id: string | null
          notes: string | null
          priority: Database["public"]["Enums"]["task_priority"]
          source_communication_id: string | null
          status: Database["public"]["Enums"]["task_status"]
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by: string
          due_date?: string | null
          id?: string
          linked_issue_id?: string | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          source_communication_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          due_date?: string | null
          id?: string
          linked_issue_id?: string | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          source_communication_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_linked_issue_id_fkey"
            columns: ["linked_issue_id"]
            isOneToOne: false
            referencedRelation: "crm_issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_source_communication_id_fkey"
            columns: ["source_communication_id"]
            isOneToOne: false
            referencedRelation: "communications"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_workspace_settings: {
        Row: {
          created_at: string
          default_owner_id: string | null
          id: string
          singleton: boolean
          updated_at: string
          website_ingest_secret_hash: string | null
          website_ingest_secret_rotated_at: string | null
          website_system_user_id: string
          workspace_name: string
        }
        Insert: {
          created_at?: string
          default_owner_id?: string | null
          id?: string
          singleton?: boolean
          updated_at?: string
          website_ingest_secret_hash?: string | null
          website_ingest_secret_rotated_at?: string | null
          website_system_user_id?: string
          workspace_name?: string
        }
        Update: {
          created_at?: string
          default_owner_id?: string | null
          id?: string
          singleton?: boolean
          updated_at?: string
          website_ingest_secret_hash?: string | null
          website_ingest_secret_rotated_at?: string | null
          website_system_user_id?: string
          workspace_name?: string
        }
        Relationships: []
      }
      document_classification_settings: {
        Row: {
          created_at: string
          id: string
          lease_threshold: number
          reclassification_behaviour: string
          reclassification_message: string
          simple_document_threshold: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lease_threshold?: number
          reclassification_behaviour?: string
          reclassification_message?: string
          simple_document_threshold?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lease_threshold?: number
          reclassification_behaviour?: string
          reclassification_message?: string
          simple_document_threshold?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          application_id: string | null
          created_at: string
          email_type: string
          error_message: string | null
          id: string
          recipient_email: string
          status: string
          subject: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string
          email_type?: string
          error_message?: string | null
          id?: string
          recipient_email: string
          status?: string
          subject?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string
          email_type?: string
          error_message?: string | null
          id?: string
          recipient_email?: string
          status?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_send_log_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "pilot_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      extraction_events: {
        Row: {
          actual_tokens: number
          amount_charged: number
          charged_type: string
          created_at: string
          declared_type: string
          document_name: string
          id: string
          reclassified: boolean
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          actual_tokens: number
          amount_charged?: number
          charged_type: string
          created_at?: string
          declared_type: string
          document_name: string
          id?: string
          reclassified?: boolean
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          actual_tokens?: number
          amount_charged?: number
          charged_type?: string
          created_at?: string
          declared_type?: string
          document_name?: string
          id?: string
          reclassified?: boolean
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          is_active: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          category: string
          created_at?: string
          id?: string
          is_active?: boolean
          question: string
          sort_order: number
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          question?: string
          sort_order?: number
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
          fts: unknown
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
          fts?: unknown
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
          fts?: unknown
          id?: string
          title?: string
          updated_at?: string
          votes?: number
        }
        Relationships: []
      }
      glossary_items: {
        Row: {
          category: string
          created_at: string
          definition: string
          id: string
          is_active: boolean
          sort_order: number
          term: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          definition: string
          id?: string
          is_active?: boolean
          sort_order: number
          term: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          definition?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          term?: string
          updated_at?: string
        }
        Relationships: []
      }
      investment_page_settings: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          updated_at?: string
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
      onboarding_pricing: {
        Row: {
          cost_per_document: number
          cost_per_lease: number
          cost_per_question_pack: number
          created_at: string
          id: string
          minimum_fee: number
          questions_per_pack: number
          updated_at: string
        }
        Insert: {
          cost_per_document?: number
          cost_per_lease?: number
          cost_per_question_pack?: number
          created_at?: string
          id?: string
          minimum_fee?: number
          questions_per_pack?: number
          updated_at?: string
        }
        Update: {
          cost_per_document?: number
          cost_per_lease?: number
          cost_per_question_pack?: number
          created_at?: string
          id?: string
          minimum_fee?: number
          questions_per_pack?: number
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
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: string
          attempts: number
          blocked_until: string | null
          first_attempt: string
          id: string
          identifier: string
          last_attempt: string
        }
        Insert: {
          action: string
          attempts?: number
          blocked_until?: string | null
          first_attempt?: string
          id?: string
          identifier: string
          last_attempt?: string
        }
        Update: {
          action?: string
          attempts?: number
          blocked_until?: string | null
          first_attempt?: string
          id?: string
          identifier?: string
          last_attempt?: string
        }
        Relationships: []
      }
      rewards: {
        Row: {
          challenge_type: string
          created_at: string
          email: string
          id: string
          ip_address: unknown
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          challenge_type?: string
          created_at?: string
          email: string
          id?: string
          ip_address?: unknown
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          challenge_type?: string
          created_at?: string
          email?: string
          id?: string
          ip_address?: unknown
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_rate_limits: {
        Row: {
          action_type: string
          created_at: string | null
          expires_at: string | null
          id: string
          identifier: string
          request_count: number | null
          window_start: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          identifier: string
          request_count?: number | null
          window_start?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          identifier?: string
          request_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      status_updates: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          service_key: string
          service_name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          service_key: string
          service_name: string
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          service_key?: string
          service_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      tier_usage_limits: {
        Row: {
          created_at: string
          id: string
          monthly_extractions: string
          monthly_questions: string
          overage_behaviour: string
          tier: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          monthly_extractions?: string
          monthly_questions?: string
          overage_behaviour?: string
          tier: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          monthly_extractions?: string
          monthly_questions?: string
          overage_behaviour?: string
          tier?: number
          updated_at?: string
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
          thumbnail_alt: string | null
          thumbnail_url: string | null
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
          thumbnail_alt?: string | null
          thumbnail_url?: string | null
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
          thumbnail_alt?: string | null
          thumbnail_url?: string | null
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
      check_contact_email_exists: {
        Args: { p_email: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          p_action: string
          p_identifier: string
          p_max_attempts?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      check_server_rate_limit: {
        Args: {
          p_action_type: string
          p_identifier: string
          p_max_requests?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      crm_find_user_id_by_email: { Args: { p_email: string }; Returns: string }
      crm_get_integration_settings: {
        Args: never
        Returns: {
          default_owner_display_name: string
          default_owner_email: string
          default_owner_id: string
          secret_configured: boolean
          website_ingest_secret_rotated_at: string
          website_system_user_id: string
        }[]
      }
      crm_get_workspace_name: { Args: never; Returns: string }
      crm_list_audit_log: {
        Args: {
          p_action?: string
          p_from?: string
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_to?: string
        }
        Returns: {
          action: string
          actor_display_name: string
          actor_email: string
          created_at: string
          id: string
          new_values: Json
          old_values: Json
          record_id: string
          table_name: string
          total_count: number
          user_id: string
        }[]
      }
      crm_list_audit_log_actions: {
        Args: never
        Returns: {
          action: string
        }[]
      }
      crm_list_team_members: {
        Args: never
        Returns: {
          display_name: string
          email: string
          granted_at: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }[]
      }
      crm_log_communication: { Args: { p_payload: Json }; Returns: string }
      crm_log_role_action: {
        Args: {
          p_action: string
          p_actor: string
          p_metadata?: Json
          p_new_role?: Database["public"]["Enums"]["app_role"]
          p_old_role?: Database["public"]["Enums"]["app_role"]
          p_target_user: string
        }
        Returns: undefined
      }
      crm_sanitise_email_html: { Args: { p_html: string }; Returns: string }
      crm_set_default_owner: { Args: { p_user_id: string }; Returns: string }
      crm_update_workspace_name: { Args: { p_name: string }; Returns: string }
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_decrypted_contact_messages: {
        Args: never
        Returns: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string
          updated_at: string
        }[]
      }
      get_safe_author_info: {
        Args: { author_user_id: string }
        Returns: {
          display_name: string
        }[]
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
      has_crm_access: { Args: { _user_id: string }; Returns: boolean }
      has_crm_write: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      insert_encrypted_contact_message: {
        Args: {
          p_email: string
          p_message: string
          p_name: string
          p_phone?: string
        }
        Returns: string
      }
      log_security_event: {
        Args: {
          p_action: string
          p_new_values?: Json
          p_old_values?: Json
          p_record_id?: string
          p_table_name: string
        }
        Returns: undefined
      }
      make_user_admin: { Args: { user_email: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user" | "crm_write" | "crm_read"
      comm_channel:
        | "email"
        | "call"
        | "meeting"
        | "video_call"
        | "sms"
        | "whatsapp"
        | "linkedin_message"
        | "letter"
        | "other"
        | "website_form"
      comm_direction: "inbound" | "outbound" | "internal"
      comm_sentiment: "positive" | "neutral" | "negative"
      feature_request_category:
        | "feedback"
        | "feature-request"
        | "integrations"
        | "questions"
        | "bug-hunting"
        | "lovable-project"
        | "ama"
      issue_category:
        | "bug"
        | "data_quality"
        | "billing"
        | "onboarding"
        | "feature_gap"
        | "support"
        | "other"
      issue_priority: "low" | "medium" | "high" | "urgent"
      issue_status:
        | "open"
        | "in_progress"
        | "waiting_on_client"
        | "resolved"
        | "closed"
      participant_kind:
        | "contact"
        | "platform_user"
        | "workspace_member"
        | "external"
      participant_role: "to" | "from" | "cc" | "bcc" | "attendee" | "organiser"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "todo" | "in_progress" | "done" | "cancelled"
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
      app_role: ["admin", "user", "crm_write", "crm_read"],
      comm_channel: [
        "email",
        "call",
        "meeting",
        "video_call",
        "sms",
        "whatsapp",
        "linkedin_message",
        "letter",
        "other",
        "website_form",
      ],
      comm_direction: ["inbound", "outbound", "internal"],
      comm_sentiment: ["positive", "neutral", "negative"],
      feature_request_category: [
        "feedback",
        "feature-request",
        "integrations",
        "questions",
        "bug-hunting",
        "lovable-project",
        "ama",
      ],
      issue_category: [
        "bug",
        "data_quality",
        "billing",
        "onboarding",
        "feature_gap",
        "support",
        "other",
      ],
      issue_priority: ["low", "medium", "high", "urgent"],
      issue_status: [
        "open",
        "in_progress",
        "waiting_on_client",
        "resolved",
        "closed",
      ],
      participant_kind: [
        "contact",
        "platform_user",
        "workspace_member",
        "external",
      ],
      participant_role: ["to", "from", "cc", "bcc", "attendee", "organiser"],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["todo", "in_progress", "done", "cancelled"],
    },
  },
} as const
