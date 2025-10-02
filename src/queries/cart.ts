import type { TypedSupabaseClient } from '@/lib/supabase-types';

/**
 * 사용자의 장바구니 아이템 조회
 */
export function getCartItems(client: TypedSupabaseClient, userId: string) {
  return client
    .from('cart_items')
    .select(
      `
      *,
      products (
        id,
        name,
        brand,
        price,
        image_url,
        in_stock
      )
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

/**
 * 장바구니에 아이템 추가 또는 수량 증가
 */
export async function addCartItem(
  client: TypedSupabaseClient,
  userId: string,
  productId: string,
  quantity: number = 1
) {
  // 이미 있는지 확인
  const { data: existing } = await client
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existing) {
    // 수량 증가
    return client
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select()
      .single();
  } else {
    // 새로 추가
    return client
      .from('cart_items')
      .insert({
        user_id: userId,
        product_id: productId,
        quantity,
      })
      .select()
      .single();
  }
}

/**
 * 장바구니 아이템 수량 업데이트
 */
export function updateCartItemQuantity(
  client: TypedSupabaseClient,
  itemId: string,
  quantity: number
) {
  return client
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .select()
    .single();
}

/**
 * 장바구니 아이템 삭제
 */
export function removeCartItem(client: TypedSupabaseClient, itemId: string) {
  return client.from('cart_items').delete().eq('id', itemId);
}

/**
 * 장바구니 전체 비우기
 */
export function clearCart(client: TypedSupabaseClient, userId: string) {
  return client.from('cart_items').delete().eq('user_id', userId);
}

/**
 * 여러 아이템을 한 번에 추가 (LocalStorage -> DB 마이그레이션용)
 */
export async function bulkAddCartItems(
  client: TypedSupabaseClient,
  userId: string,
  items: Array<{ product_id: string; quantity: number }>
) {
  // 기존 장바구니 비우기
  await clearCart(client, userId);

  // 새로운 아이템들 추가
  return client
    .from('cart_items')
    .insert(
      items.map((item) => ({
        user_id: userId,
        product_id: item.product_id,
        quantity: item.quantity,
      }))
    )
    .select();
}
