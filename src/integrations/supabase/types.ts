export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      talks: {
        Row: {
          id: string;
          speaker_name: string;
          congregation: string;
          theme: string;
          talk_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          speaker_name: string;
          congregation: string;
          theme: string;
          talk_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          speaker_name?: string;
          congregation?: string;
          theme?: string;
          talk_date?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
