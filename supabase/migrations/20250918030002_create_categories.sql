-- =============================================
-- 카테고리 테이블 생성
-- =============================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_categories_display_order ON categories(display_order);
CREATE INDEX idx_categories_active ON categories(is_active) WHERE is_active = true;

-- 트리거 생성
CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 초기 카테고리 데이터 (Mock 데이터 기반으로 추가 예정)
INSERT INTO categories (name, description, display_order) VALUES
('전체', '모든 제품', 0),
('나스티', '나스티 브랜드 제품', 1),
('코스모스', '코스모스 브랜드 제품', 2),
('맥스웰', '맥스웰 브랜드 제품', 3),
('더원', '더원 브랜드 제품', 4),
('프리미엄', '프리미엄 브랜드 제품', 5);
