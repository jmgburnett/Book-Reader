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
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      books: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          author: string | null;
          file_path: string;
          file_size: number | null;
          page_count: number | null;
          total_text_length: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          author?: string | null;
          file_path: string;
          file_size?: number | null;
          page_count?: number | null;
          total_text_length?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          author?: string | null;
          file_path?: string;
          file_size?: number | null;
          page_count?: number | null;
          total_text_length?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      voices: {
        Row: {
          id: string;
          user_id: string;
          elevenlabs_voice_id: string;
          name: string;
          description: string | null;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          elevenlabs_voice_id: string;
          name: string;
          description?: string | null;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          elevenlabs_voice_id?: string;
          name?: string;
          description?: string | null;
          is_default?: boolean;
          created_at?: string;
        };
      };
      reading_progress: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          current_page: number;
          current_position: number;
          progress_percentage: number;
          last_read_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          current_page?: number;
          current_position?: number;
          progress_percentage?: number;
          last_read_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
          current_page?: number;
          current_position?: number;
          progress_percentage?: number;
          last_read_at?: string;
        };
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          page_number: number;
          position: number | null;
          text_snippet: string | null;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          page_number: number;
          position?: number | null;
          text_snippet?: string | null;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
          page_number?: number;
          position?: number | null;
          text_snippet?: string | null;
          note?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
