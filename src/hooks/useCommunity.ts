'use client'

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { createClient } from '@/lib/supabase'
import { 
  getCommunityPosts, 
  getPopularCommunityPosts,
  getHotCommunityPosts,
  getPinnedCommunityPosts,
  getCommunityCategories,
  getCommunityPostById,
  searchCommunityPosts,
  getActiveCommunityPosts,
  getCommunityPostsByCategory
} from '@/queries/community'

/**
 * 모든 커뮤니티 게시글 조회 Hook
 */
export function useCommunityPosts() {
  const supabase = createClient()
  
  return useQuery(getCommunityPosts(supabase), {
    select: (data) => data ?? [],
  })
}

/**
 * 인기 커뮤니티 게시글 조회 Hook
 */
export function usePopularCommunityPosts(limit = 10) {
  const supabase = createClient()
  
  return useQuery(getPopularCommunityPosts(supabase, limit), {
    select: (data) => data ?? [],
  })
}

/**
 * 핫 게시글 조회 Hook
 */
export function useHotCommunityPosts(limit = 10) {
  const supabase = createClient()
  
  return useQuery(getHotCommunityPosts(supabase, limit), {
    select: (data) => data ?? [],
  })
}

/**
 * 고정 게시글 조회 Hook
 */
export function usePinnedCommunityPosts() {
  const supabase = createClient()
  
  return useQuery(getPinnedCommunityPosts(supabase), {
    select: (data) => data ?? [],
  })
}

/**
 * 커뮤니티 카테고리 조회 Hook
 */
export function useCommunityCategories() {
  const supabase = createClient()
  
  return useQuery(getCommunityCategories(supabase), {
    select: (data) => data ?? [],
  })
}

/**
 * 특정 게시글 상세 조회 Hook
 */
export function useCommunityPost(id: string) {
  const supabase = createClient()
  
  return useQuery(getCommunityPostById(supabase, id), {
    enabled: !!id,
  })
}

/**
 * 활발한 토론 게시글 조회 Hook
 */
export function useActiveCommunityPosts(limit = 10) {
  const supabase = createClient()
  
  return useQuery(getActiveCommunityPosts(supabase, limit), {
    select: (data) => data ?? [],
  })
}

/**
 * 카테고리별 게시글 조회 Hook
 */
export function useCommunityPostsByCategory(categoryId: string, limit = 20) {
  const supabase = createClient()
  
  return useQuery(getCommunityPostsByCategory(supabase, categoryId, limit), {
    enabled: !!categoryId,
    select: (data) => data ?? [],
  })
}

/**
 * 커뮤니티 게시글 검색 Hook
 */
export function useSearchCommunityPosts(query: string, limit = 20) {
  const supabase = createClient()
  
  return useQuery(searchCommunityPosts(supabase, query, limit), {
    enabled: !!query && query.length > 0,
    select: (data) => data ?? [],
  })
}
