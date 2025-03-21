export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          firebase_uid: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          is_pro: boolean;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          firebase_uid: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          is_pro?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          firebase_uid?: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          is_pro?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      projects: {
        Row: {
          id: number;
          user_id: string;
          title: string;
          description: string | null;
          video_url: string | null;
          thumbnail_url: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          title: string;
          description?: string | null;
          video_url?: string | null;
          thumbnail_url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          user_id?: string;
          title?: string;
          description?: string | null;
          video_url?: string | null;
          thumbnail_url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      subtitles: {
        Row: {
          id: number;
          project_id: number;
          start_time: number;
          end_time: number;
          text: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          project_id: number;
          start_time: number;
          end_time: number;
          text: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          project_id?: number;
          start_time?: number;
          end_time?: number;
          text?: string;
          created_at?: string;
          updated_at?: string | null;
        };
      };
    };
  };
}
