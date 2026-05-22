// Hand-written Database type for Supabase client.
//
// This file mirrors the schema in `supabase/migrations/`. It plays the role of
// what `supabase gen types typescript --project-id <ref>` would generate.
//
// REGENERATION: when the schema changes, either re-run this hand-write step
// based on the new migrations, or set up the CLI and switch to:
//   `supabase gen types typescript --project-id <ref> --schema public > src/types/supabase.ts`
//
// IMPORTANT: `gen types` outputs `string` for CHECK-constrained text columns
// (it does NOT introspect CHECK constraints). The literal unions for
// `deals.status` below are tighter than what gen types would produce — this is
// intentional. If you ever overwrite this file with the CLI output, you may
// want to manually narrow `deals.status` again.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      deals: {
        Row: {
          id: string;
          title: string;
          current_price: number;
          previous_price: number | null;
          average_price: number | null;
          discount_percent: number | null;
          image_url: string | null;
          original_url: string;
          affiliate_url: string | null;
          source: string;
          status: 'pending' | 'published' | 'rejected';
          found_at: string;
          published_at: string | null;
          telegram_message_id: number | null;
          chollometro_id: string | null;
          group_id: string | null;
          youtube_review_url: string | null;
          hashtags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          current_price: number;
          previous_price?: number | null;
          average_price?: number | null;
          discount_percent?: number | null;
          image_url?: string | null;
          original_url: string;
          affiliate_url?: string | null;
          source: string;
          status?: 'pending' | 'published' | 'rejected';
          found_at?: string;
          published_at?: string | null;
          telegram_message_id?: number | null;
          chollometro_id?: string | null;
          group_id?: string | null;
          youtube_review_url?: string | null;
          hashtags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          current_price?: number;
          previous_price?: number | null;
          average_price?: number | null;
          discount_percent?: number | null;
          image_url?: string | null;
          original_url?: string;
          affiliate_url?: string | null;
          source?: string;
          status?: 'pending' | 'published' | 'rejected';
          found_at?: string;
          published_at?: string | null;
          telegram_message_id?: number | null;
          chollometro_id?: string | null;
          group_id?: string | null;
          youtube_review_url?: string | null;
          hashtags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'users_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedSchema: 'auth';
            referencedColumns: ['id'];
          },
        ];
      };
      posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          author: string;
          published_at: string;
          thumbnail_url: string;
          markdown_path: string;
          status: Database['public']['Enums']['statusType'];
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          author: string;
          published_at?: string;
          thumbnail_url: string;
          markdown_path: string;
          status?: Database['public']['Enums']['statusType'];
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          author?: string;
          published_at?: string;
          thumbnail_url?: string;
          markdown_path?: string;
          status?: Database['public']['Enums']['statusType'];
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      handle_new_user: {
        Args: Record<string, never>;
        Returns: unknown;
      };
      update_updated_at_deals: {
        Args: Record<string, never>;
        Returns: unknown;
      };
    };
    Enums: {
      // public.statusType — used by posts.status.
      // If your schema has more values than these two, add them here.
      // Confirmed referenced in code: 'published'. Spec uses 'draft' for unpublished.
      statusType: 'draft' | 'published';
    };
    CompositeTypes: Record<string, never>;
  };
}

// -----------------------------------------------------------------------
// Convenience aliases (optional — services can extract types directly
// from `Database` instead, this just keeps imports terse).
// -----------------------------------------------------------------------

export type DealRow = Database['public']['Tables']['deals']['Row'];
export type DealInsert = Database['public']['Tables']['deals']['Insert'];
export type DealUpdate = Database['public']['Tables']['deals']['Update'];
export type DealStatus = DealRow['status'];

// `UserRecord` instead of `User` — `User` collides with @supabase/supabase-js's
// own User export (the auth principal). They are different things.
export type UserRecord = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type Post = Database['public']['Tables']['posts']['Row'];
export type PostInsert = Database['public']['Tables']['posts']['Insert'];
export type PostUpdate = Database['public']['Tables']['posts']['Update'];
export type PostStatus = Database['public']['Enums']['statusType'];
