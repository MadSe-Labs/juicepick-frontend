-- =============================================
-- 주문 관련 테이블 생성
-- =============================================

-- 주문 테이블
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL, -- ORDER-001 형태
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  order_date TIMESTAMPTZ DEFAULT NOW(),
  delivery_date TIMESTAMPTZ,
  shipping_address_id UUID REFERENCES user_addresses(id),
  -- 주소가 삭제되어도 주문 기록은 보존하기 위해 주소 정보 복사본 저장
  shipping_recipient_name VARCHAR(100),
  shipping_recipient_phone VARCHAR(20),
  shipping_zip_code VARCHAR(10),
  shipping_address VARCHAR(500),
  shipping_detail_address VARCHAR(200),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 주문 상품 테이블
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name VARCHAR(200) NOT NULL, -- 상품명 스냅샷
  product_brand VARCHAR(100) NOT NULL,
  product_image_url TEXT,
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- 트리거 생성
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security 설정
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid()::uuid = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid()::uuid AND users.role = 'admin')
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND auth.uid()::uuid = orders.user_id)
);
CREATE POLICY "Admins can view all order items" ON order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid()::uuid AND users.role = 'admin')
);
