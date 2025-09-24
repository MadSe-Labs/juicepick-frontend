'use client'

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { createClient } from '@/lib/supabase'
import { 
  getProducts, 
  getProductById, 
  getPopularProducts,
  getNewProducts 
} from '@/queries/products'

/**
 * 모든 제품 조회 Hook
 */
export function useProducts() {
  const supabase = createClient()
  
  return useQuery(getProducts(supabase), {
    // 데이터가 null인 경우 빈 배열로 변환
    select: (data) => data ?? [],
  })
}

/**
 * 특정 제품 상세 조회 Hook
 */
export function useProduct(id: string) {
  const supabase = createClient()
  
  return useQuery(getProductById(supabase, id), {
    enabled: !!id,
  })
}

/**
 * 인기 제품 조회 Hook
 */
export function usePopularProducts(limit = 10) {
  const supabase = createClient()
  
  return useQuery(getPopularProducts(supabase, limit), {
    // 데이터가 null인 경우 빈 배열로 변환
    select: (data) => data ?? [],
  })
}

/**
 * 신제품 조회 Hook
 */
export function useNewProducts(limit = 10) {
  const supabase = createClient()
  
  return useQuery(getNewProducts(supabase, limit), {
    // 데이터가 null인 경우 빈 배열로 변환
    select: (data) => data ?? [],
  })
}
