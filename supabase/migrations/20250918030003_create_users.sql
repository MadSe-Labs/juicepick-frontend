-- =============================================
-- 사용자 기본 테이블 생성 (인증 정보만)
-- =============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255), -- 소셜 로그인의 경우 NULL
  auth_provider VARCHAR(50) DEFAULT 'email', -- email, google, kakao, naver
  auth_provider_id VARCHAR(255), -- 소셜 로그인 ID
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_auth CHECK (
    (auth_provider = 'email' AND password_hash IS NOT NULL) OR
    (auth_provider != 'email' AND auth_provider_id IS NOT NULL)
  )
);

-- 인덱스 생성
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_auth_provider ON users(auth_provider, auth_provider_id);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;

-- 트리거 생성
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security 설정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::uuid = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::uuid = id);
