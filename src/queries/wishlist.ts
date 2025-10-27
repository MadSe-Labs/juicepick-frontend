import type { TypedSupabaseClient } from '@/lib/supabase-types';

/**
 * 사용자의 위시리스트 조회 (상품 정보 포함)
 */
export function getUserWishlist(client: TypedSupabaseClient, userId: string) {
  return (client as any)
    .from('wishlist_items')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

/**
 * 특정 상품이 위시리스트에 있는지 확인
 */
export function checkProductInWishlist(
  client: TypedSupabaseClient,
  userId: string,
  productId: string
) {
  return (client as any)
    .from('wishlist_items')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();
}

/**
 * 위시리스트에 상품 추가
 */
export function addToWishlist(
  client: TypedSupabaseClient,
  userId: string,
  productId: string
) {
  return (client as any)
    .from('wishlist_items')
    .insert({
      user_id: userId,
      product_id: productId,
    })
    .select()
    .single();
}

/**
 * 위시리스트에서 상품 제거
 */
export function removeFromWishlist(
  client: TypedSupabaseClient,
  userId: string,
  productId: string
) {
  return (client as any)
    .from('wishlist_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
}

/**
 * 위시리스트 전체 삭제
 */
export function clearWishlist(client: TypedSupabaseClient, userId: string) {
  return (client as any)
    .from('wishlist_items')
    .delete()
    .eq('user_id', userId);
}

/**
 * 위시리스트 통계 조회
 */
export async function getWishlistStats(
  client: TypedSupabaseClient,
  userId: string
) {
  const { data, error } = await (client as any).rpc('get_user_wishlist_stats', {
    user_uuid: userId,
  });

  if (error) throw error;
  return data?.[0] || { total_items: 0, total_value: 0 };
}
