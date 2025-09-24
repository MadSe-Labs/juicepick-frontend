import type { TypedSupabaseClient } from '@/lib/supabase-types'

/**
 * 모든 커뮤니티 게시글 조회
 */
export function getCommunityPosts(client: TypedSupabaseClient) {
  return client
    .from('community_posts')
    .select(`
      *,
      community_categories(name)
    `)
    .order('created_at', { ascending: false })
}

/**
 * 인기 커뮤니티 게시글 조회 (좋아요 수 기준)
 */
export function getPopularCommunityPosts(client: TypedSupabaseClient, limit = 10) {
  return client
    .from('community_posts')
    .select(`
      *,
      community_categories(name)
    `)
    .order('likes', { ascending: false })
    .limit(limit)
}

/**
 * 핫 게시글 조회 (최근 일주일 내 좋아요/조회수 높은 글)
 */
export function getHotCommunityPosts(
  client: TypedSupabaseClient,
  limit = 10
) {
  // ✅ 오늘 00:00 기준 7일 전 (매일 00:00에만 변경)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);  // 00:00:00.000으로 고정
  
  return client
    .from('community_posts')
    .select(`
      *,
      community_categories(name)
    `)
    .gte('created_at', weekAgo.toISOString())
    .order('likes', { ascending: false })
    .limit(limit)
}

/**
 * 고정 게시글 조회
 */
export function getPinnedCommunityPosts(client: TypedSupabaseClient) {
  return client
    .from('community_posts')
    .select(`
      *,
      community_categories(name)
    `)
    .eq('is_pinned', true)
    .order('created_at', { ascending: false })
}

/**
 * 카테고리별 게시글 조회
 */
export function getCommunityPostsByCategory(
  client: TypedSupabaseClient, 
  categoryId: string,
  limit = 20
) {
  return client
    .from('community_posts')
    .select(`
      *,
      community_categories(name)
    `)
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })
    .limit(limit)
}

/**
 * 커뮤니티 카테고리 목록 조회
 */
export function getCommunityCategories(client: TypedSupabaseClient) {
  return client
    .from('community_categories')
    .select(`
      *,
      community_posts(count)
    `)
    .order('display_order', { ascending: true })
}

/**
 * 특정 게시글 상세 조회
 */
export function getCommunityPostById(client: TypedSupabaseClient, id: string) {
  return client
    .from('community_posts')
    .select(`
      *,
      community_categories(name),
      community_comments(*)
    `)
    .eq('id', id)
    .single()
}

/**
 * 커뮤니티 게시글 검색
 */
export function searchCommunityPosts(
  client: TypedSupabaseClient, 
  query: string, 
  limit = 20
) {
  return client
    .from('community_posts')
    .select(`
      *,
      community_categories(name)
    `)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit)
}

/**
 * 최신 댓글이 있는 게시글 조회 (활발한 토론)
 */
export function getActiveCommunityPosts(client: TypedSupabaseClient, limit = 10) {
  return client
    .from('community_posts')
    .select(`
      *,
      community_categories(name),
      community_comments(created_at)
    `)
    .order('updated_at', { ascending: false })
    .limit(limit)
}
