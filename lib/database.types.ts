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
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          compare_at_price: number | null;
          images: string[];
          category: string;
          subcategory: string | null;
          tags: string[];
          in_stock: boolean;
          stock_quantity: number;
          sku: string;
          weight: number | null;
          dimensions: Json | null;
          supplier: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          compare_at_price?: number | null;
          images?: string[];
          category: string;
          subcategory?: string | null;
          tags?: string[];
          in_stock?: boolean;
          stock_quantity?: number;
          sku: string;
          weight?: number | null;
          dimensions?: Json | null;
          supplier?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          compare_at_price?: number | null;
          images?: string[];
          category?: string;
          subcategory?: string | null;
          tags?: string[];
          in_stock?: boolean;
          stock_quantity?: number;
          sku?: string;
          weight?: number | null;
          dimensions?: Json | null;
          supplier?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image: string | null;
          parent_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          status: string;
          total_amount: number;
          shipping_address: Json;
          billing_address: Json;
          payment_method: string;
          payment_status: string;
          shipping_method: string;
          shipping_cost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_number: string;
          status?: string;
          total_amount: number;
          shipping_address: Json;
          billing_address: Json;
          payment_method: string;
          payment_status?: string;
          shipping_method: string;
          shipping_cost?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_number?: string;
          status?: string;
          total_amount?: number;
          shipping_address?: Json;
          billing_address?: Json;
          payment_method?: string;
          payment_status?: string;
          shipping_method?: string;
          shipping_cost?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
