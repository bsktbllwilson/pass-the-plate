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
      listings: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          industry: string
          cuisine: string
          location: string
          asking_price_cents: number
          annual_revenue_cents: number
          annual_profit_cents: number | null
          year_established: number | null
          staff_count: number | null
          square_footage: number | null
          cover_image_url: string | null
          gallery_urls: string[]
          assets: Json
          view_count: number
          status: string
          seller_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description: string
          industry: string
          cuisine: string
          location: string
          asking_price_cents: number
          annual_revenue_cents: number
          annual_profit_cents?: number | null
          year_established?: number | null
          staff_count?: number | null
          square_footage?: number | null
          cover_image_url?: string | null
          gallery_urls?: string[]
          assets?: Json
          view_count?: number
          status?: string
          seller_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string
          industry?: string
          cuisine?: string
          location?: string
          asking_price_cents?: number
          annual_revenue_cents?: number
          annual_profit_cents?: number | null
          year_established?: number | null
          staff_count?: number | null
          square_footage?: number | null
          cover_image_url?: string | null
          gallery_urls?: string[]
          assets?: Json
          view_count?: number
          status?: string
          seller_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      partners: {
        Row: {
          id: string
          full_name: string
          job_title: string | null
          company: string | null
          email: string
          phone: string | null
          website: string | null
          address: string | null
          languages: string[]
          bio: string | null
          specialty: string
          approved: boolean
          featured: boolean
          referral_source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          job_title?: string | null
          company?: string | null
          email: string
          phone?: string | null
          website?: string | null
          address?: string | null
          languages?: string[]
          bio?: string | null
          specialty: string
          approved?: boolean
          featured?: boolean
          referral_source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          job_title?: string | null
          company?: string | null
          email?: string
          phone?: string | null
          website?: string | null
          address?: string | null
          languages?: string[]
          bio?: string | null
          specialty?: string
          approved?: boolean
          featured?: boolean
          referral_source?: string | null
          created_at?: string
        }
      }
      playbook_posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string | null
          body_md: string
          category: string
          cover_image_url: string | null
          author_name: string
          published: boolean
          published_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt?: string | null
          body_md: string
          category: string
          cover_image_url?: string | null
          author_name: string
          published?: boolean
          published_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          excerpt?: string | null
          body_md?: string
          category?: string
          cover_image_url?: string | null
          author_name?: string
          published?: boolean
          published_at?: string | null
          created_at?: string
        }
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
