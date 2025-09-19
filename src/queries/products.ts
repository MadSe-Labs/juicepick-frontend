import type { TypedSupabaseClient } from '@/lib/supabase-types'

/**
 * 모든 제품 조회
 */
export function getProducts(client: TypedSupabaseClient) {
  return client
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
}

/**
 * 특정 제품 상세 조회
 */
export function getProductById(client: TypedSupabaseClient, id: string) {
  return client
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
}

/**
 * 인기 제품 조회
 */
export function getPopularProducts(client: TypedSupabaseClient, limit = 10) {
  return client
    .from('products')
    .select('*')
    .eq('is_popular', true)
    .limit(limit)
}

/**
 * 신제품 조회
 */
export function getNewProducts(client: TypedSupabaseClient, limit = 10) {
  return client
    .from('products')
    .select('*')
    .eq('is_new', true)
    .order('created_at', { ascending: false })
    .limit(limit)
}

/**
 * 카테고리별 제품 조회
 */
export function getProductsByCategory(
  client: TypedSupabaseClient,
  categoryId: string
) {
  return client
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })
}

/**
 * 브랜드별 제품 조회
 */
export function getProductsByBrand(
  client: TypedSupabaseClient,
  brand: string
) {
  return client
    .from('products')
    .select('*')
    .eq('brand', brand)
    .order('created_at', { ascending: false })
}
