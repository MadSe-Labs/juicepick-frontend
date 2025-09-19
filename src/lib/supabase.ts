import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'
import type { TypedSupabaseClient } from './supabase-types'

// Browser (Client Component) Supabase Client
export function createClient(): TypedSupabaseClient {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// 레거시 호환성을 위한 기본 export
export const supabase = createClient()

// Database 타입 내보내기
export type { Database }

// 유틸리티 타입들 내보내기
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// 주요 테이블 타입들
export type Product = Tables<'products'>
export type Category = Tables<'categories'>
export type User = Tables<'users'>
export type UserProfile = Tables<'user_profiles'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>
export type Review = Tables<'reviews'>
export type CommunityPost = Tables<'community_posts'>
