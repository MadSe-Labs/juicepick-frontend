-- =============================================
-- 찜하기/위시리스트 테이블 생성
-- =============================================

-- 위시리스트 테이블
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 한 사용자당 같은 상품을 중복으로 찜할 수 없음
  UNIQUE(user_id, product_id)
);

-- 인덱스 생성 (조회 성능 최적화)
CREATE INDEX idx_wishlist_user_id ON wishlist_items(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlist_items(product_id);
CREATE INDEX idx_wishlist_created_at ON wishlist_items(created_at DESC);

-- 제품별 찜 횟수를 저장할 컬럼 추가
ALTER TABLE products ADD COLUMN IF NOT EXISTS wishlist_count INTEGER DEFAULT 0 CHECK (wishlist_count >= 0);
CREATE INDEX idx_products_wishlist_count ON products(wishlist_count DESC);

-- 위시리스트 아이템 추가/삭제 시 제품의 찜 횟수 자동 업데이트
CREATE OR REPLACE FUNCTION update_product_wishlist_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE products SET wishlist_count = wishlist_count + 1 WHERE id = NEW.product_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE products SET wishlist_count = wishlist_count - 1 WHERE id = OLD.product_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_wishlist_count_trigger
  AFTER INSERT OR DELETE ON wishlist_items
  FOR EACH ROW EXECUTE FUNCTION update_product_wishlist_count();

-- Row Level Security 설정
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 위시리스트만 조회/관리 가능
CREATE POLICY "Users can view own wishlist" 
  ON wishlist_items FOR SELECT 
  USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can add to own wishlist" 
  ON wishlist_items FOR INSERT 
  WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Users can remove from own wishlist" 
  ON wishlist_items FOR DELETE 
  USING (auth.uid()::uuid = user_id);

-- 위시리스트 통계 조회 함수 (옵션)
CREATE OR REPLACE FUNCTION get_user_wishlist_stats(user_uuid UUID)
RETURNS TABLE (
  total_items BIGINT,
  total_value DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_items,
    COALESCE(SUM(p.price), 0)::DECIMAL(10,2) as total_value
  FROM wishlist_items w
  JOIN products p ON w.product_id = p.id
  WHERE w.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;
