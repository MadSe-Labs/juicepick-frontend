-- =============================================
-- 사용자 주소 테이블 생성 (다중 배송지 지원)
-- =============================================

CREATE TABLE user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- 주소 별칭 (집, 회사, 친구집 등)
  recipient_name VARCHAR(100) NOT NULL, -- 수령인 이름
  recipient_phone VARCHAR(20) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  address VARCHAR(500) NOT NULL,
  detail_address VARCHAR(200),
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 한 사용자당 하나의 기본 주소만 가질 수 있도록 제약
  CONSTRAINT unique_default_address_per_user 
    EXCLUDE (user_id WITH =) WHERE (is_default = true)
);

-- 인덱스 생성
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_user_addresses_default ON user_addresses(user_id) WHERE is_default = true;
CREATE INDEX idx_user_addresses_active ON user_addresses(user_id) WHERE is_active = true;

-- 트리거 생성
CREATE TRIGGER update_user_addresses_updated_at 
  BEFORE UPDATE ON user_addresses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security 설정
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own addresses" ON user_addresses FOR ALL USING (auth.uid()::uuid = user_id);
