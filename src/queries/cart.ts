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
 * DB 기존 상품 유지, 중복 상품은 수량 합산
 */
export async function bulkAddCartItems(
  client: TypedSupabaseClient,
  userId: string,
  items: Array<{ product_id: string; quantity: number }>
) {
  // 1. DB 기존 장바구니 조회
  const { data: existingItems, error: fetchError } = await client
    .from('cart_items')
    .select('*')
    .eq('user_id', userId);

  if (fetchError) throw fetchError;

  // 2. 기존 상품 Map 생성 (product_id -> cart_item)
  const existingMap = new Map(
    (existingItems || []).map((item) => [item.product_id, item])
  );

  // 3. LocalStorage 상품 처리
  const insertItems: Array<{ user_id: string; product_id: string; quantity: number }> = [];

  for (const item of items) {
    const existing = existingMap.get(item.product_id);

    if (existing) {
      // 중복 상품: 수량 합산 (update)
      const { error: updateError } = await client
        .from('cart_items')
        .update({ quantity: existing.quantity + item.quantity })
        .eq('id', existing.id);

      if (updateError) throw updateError;
    } else {
      // 신규 상품: 추가 대기열에 추가
      insertItems.push({
        user_id: userId,
        product_id: item.product_id,
        quantity: item.quantity,
      });
    }
  }

  // 4. 신규 상품 추가
  if (insertItems.length > 0) {
    const { error: insertError } = await client
      .from('cart_items')
      .insert(insertItems);

    if (insertError) throw insertError;
  }

  // 5. 최종 장바구니 조회하여 반환
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
