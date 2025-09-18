-- =============================================
-- 제품 테이블 생성
-- =============================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(10,2) CHECK (original_price >= 0 AND original_price >= price),
  discount_percentage INTEGER CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  image_url TEXT NOT NULL,
  image_urls TEXT[], -- 추가 이미지들
  flavor VARCHAR(100),
  nicotine VARCHAR(20), -- "3mg", "6mg", "무니코틴" 등
  volume VARCHAR(20), -- "30ml", "60ml" 등
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  is_popular BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  sellers_count INTEGER DEFAULT 1, -- 판매자 수
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_rating ON products(rating DESC);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_popular ON products(is_popular) WHERE is_popular = true;
CREATE INDEX idx_products_new ON products(is_new) WHERE is_new = true;
CREATE INDEX idx_products_in_stock ON products(in_stock) WHERE in_stock = true;
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_flavor ON products(flavor);
CREATE INDEX idx_products_nicotine ON products(nicotine);

-- 트리거 생성
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security 설정
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view products" ON products FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admins can manage products" ON products FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid()::uuid AND users.role = 'admin')
);
