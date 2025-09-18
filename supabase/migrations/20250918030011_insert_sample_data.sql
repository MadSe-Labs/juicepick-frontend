-- =============================================
-- 기본 데이터 삽입 (Mock 데이터 기반)
-- =============================================

-- 커뮤니티 카테고리 기본 데이터
INSERT INTO community_categories (name, description, color, display_order) VALUES
('전체', '모든 게시글', 'bg-blue-50 text-blue-700', 0),
('제품후기', '제품 사용 후기 및 리뷰', 'bg-green-50 text-green-700', 1),
('질문/답변', '궁금한 점들을 질문하고 답변해보세요', 'bg-orange-50 text-orange-700', 2),
('DIY/팁', 'DIY 레시피와 유용한 팁 공유', 'bg-purple-50 text-purple-700', 3),
('정보공유', '유용한 정보들을 공유해주세요', 'bg-red-50 text-red-700', 4),
('뉴스/소식', '업계 뉴스와 최신 소식', 'bg-indigo-50 text-indigo-700', 5);

-- 테스트용 사용자 데이터 (실제 운영에서는 제거)
-- 비밀번호: "password123" (bcrypt 해시)
INSERT INTO users (id, email, password_hash, role, email_verified, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'test@juicepick.com', '$2b$10$K7L/8/GsX4/vN9xLFJ8P8elB7Lz8SHwUKJGV3zXtFYdQ2Z4oSFJoK', 'user', true, true),
('550e8400-e29b-41d4-a716-446655440001', 'admin@juicepick.com', '$2b$10$K7L/8/GsX4/vN9xLFJ8P8elB7Lz8SHwUKJGV3zXtFYdQ2Z4oSFJoK', 'admin', true, true),
('550e8400-e29b-41d4-a716-446655440002', 'user@example.com', '$2b$10$K7L/8/GsX4/vN9xLFJ8P8elB7Lz8SHwUKJGV3zXtFYdQ2Z4oSFJoK', 'user', true, true);

-- 사용자 프로필 데이터
INSERT INTO user_profiles (user_id, display_name, first_name, last_name, birth_date, gender, newsletter_subscribed, push_notifications_enabled) VALUES
('550e8400-e29b-41d4-a716-446655440000', '김민준', '민준', '김', '1990-05-15', 'male', true, true),
('550e8400-e29b-41d4-a716-446655440001', '관리자', '관리자', '', '1985-03-20', 'male', true, true),
('550e8400-e29b-41d4-a716-446655440002', '일반 사용자', '사용자', '일반', '1995-12-10', 'female', false, false);

-- 사용자 주소 데이터
INSERT INTO user_addresses (user_id, name, recipient_name, recipient_phone, zip_code, address, detail_address, is_default) VALUES
('550e8400-e29b-41d4-a716-446655440000', '집', '김민준', '010-1234-5678', '06142', '서울특별시 강남구 테헤란로 123', '456호', true),
('550e8400-e29b-41d4-a716-446655440001', '사무실', '관리자', '010-9876-5432', '04512', '서울특별시 중구 세종대로 110', '관리자실', true),
('550e8400-e29b-41d4-a716-446655440002', '집', '일반 사용자', '010-5555-6666', '07654', '경기도 성남시 분당구 판교역로 166', '101동 2002호', true);

-- 샘플 제품 데이터 (Mock 데이터에서 일부 추출)
INSERT INTO products (id, name, brand, description, price, original_price, discount_percentage, rating, review_count, image_url, image_urls, flavor, nicotine, volume, is_popular, is_new, in_stock) VALUES
('550e8400-e29b-41d4-a716-446655440100', '나스티 망고 아이스', '나스티', '망고의 달콤함과 시원한 아이스가 만나 완벽한 조화를 이루는 프리미엄 액상', 12000, 15000, 20, 4.8, 124, '/images/nasty-mango.jpg', ARRAY['/images/nasty-mango.jpg', '/images/nasty-mango-2.jpg', '/images/nasty-mango-3.jpg'], '망고 아이스', '3mg', '60ml', true, false, true),
('550e8400-e29b-41d4-a716-446655440101', '코스모스 스트로베리 밀크', '코스모스', '신선한 딸기와 부드러운 우유의 완벽한 조화', 8000, null, null, 4.6, 89, '/images/cosmos-strawberry.jpg', ARRAY['/images/cosmos-strawberry.jpg', '/images/cosmos-strawberry-2.jpg'], '스트로베리 밀크', '6mg', '30ml', false, true, true),
('550e8400-e29b-41d4-a716-446655440102', '맥스웰 블루베리 타르트', '맥스웰', '진짜 블루베리 타르트를 먹는 듯한 달콤하고 새콤한 맛', 13500, 16000, 15, 4.7, 156, '/images/maxwell-blueberry.jpg', ARRAY['/images/maxwell-blueberry.jpg', '/images/maxwell-blueberry-2.jpg', '/images/maxwell-blueberry-3.jpg'], '블루베리 타르트', '3mg', '60ml', true, false, true),
('550e8400-e29b-41d4-a716-446655440103', '더원 바닐라 크림', '더원', '부드럽고 진한 바닐라 크림의 깊은 맛', 9500, null, null, 4.4, 67, '/images/theone-vanilla.jpg', ARRAY['/images/theone-vanilla.jpg', '/images/theone-vanilla-2.jpg'], '바닐라 크림', '6mg', '30ml', false, false, false),
('550e8400-e29b-41d4-a716-446655440104', '나스티 그린애플', '나스티', '상큼한 그린애플의 깔끔하고 시원한 맛', 11000, null, null, 4.5, 78, '/images/nasty-greenapple.jpg', ARRAY['/images/nasty-greenapple.jpg'], '그린애플', '3mg', '60ml', false, true, true);

-- 샘플 주문 데이터
INSERT INTO orders (id, order_number, user_id, total_amount, status, order_date, shipping_recipient_name, shipping_recipient_phone, shipping_zip_code, shipping_address, shipping_detail_address) VALUES
('550e8400-e29b-41d4-a716-446655440200', 'ORDER-001', '550e8400-e29b-41d4-a716-446655440000', 37500, 'delivered', '2024-08-15 10:30:00', '김민준', '010-1234-5678', '06142', '서울특별시 강남구 테헤란로 123', '456호'),
('550e8400-e29b-41d4-a716-446655440201', 'ORDER-002', '550e8400-e29b-41d4-a716-446655440000', 24000, 'shipped', '2024-08-28 14:20:00', '김민준', '010-1234-5678', '06142', '서울특별시 강남구 테헤란로 123', '456호'),
('550e8400-e29b-41d4-a716-446655440202', 'ORDER-003', '550e8400-e29b-41d4-a716-446655440000', 11000, 'processing', '2024-09-01 09:15:00', '김민준', '010-1234-5678', '06142', '서울특별시 강남구 테헤란로 123', '456호');

-- 주문 상품 데이터
INSERT INTO order_items (order_id, product_id, product_name, product_brand, product_image_url, unit_price, quantity, total_price) VALUES
('550e8400-e29b-41d4-a716-446655440200', '550e8400-e29b-41d4-a716-446655440100', '나스티 망고 아이스', '나스티', '/images/nasty-mango.jpg', 12000, 2, 24000),
('550e8400-e29b-41d4-a716-446655440200', '550e8400-e29b-41d4-a716-446655440102', '맥스웰 블루베리 타르트', '맥스웰', '/images/maxwell-blueberry.jpg', 13500, 1, 13500),
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440101', '코스모스 스트로베리 밀크', '코스모스', '/images/cosmos-strawberry.jpg', 8000, 3, 24000),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440104', '나스티 그린애플', '나스티', '/images/nasty-greenapple.jpg', 11000, 1, 11000);

-- 샘플 리뷰 데이터
INSERT INTO reviews (product_id, user_id, rating, title, content, pros, cons, tags, is_verified_purchase) VALUES
('550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440000', 5, '정말 맛있는 액상입니다!', '처음에는 기대 안했는데 정말 맛있어요. 과일 맛이 진하고 목넘김도 부드러워서 매일 사용하고 있습니다.', ARRAY['진한 과일맛', '부드러운 목넘김', '가성비 좋음'], ARRAY['냄새가 좀 강함'], ARRAY['과일맛', '입문자추천', '가성비'], true),
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440002', 4, '딸기우유 그 자체!', '진짜 딸기우유 마시는 느낌이에요. 달콤하고 부드러워서 스트레스 받을 때 피우면 기분이 좋아져요.', ARRAY['진짜 딸기우유맛', '달콤함', '좋은 연무량'], ARRAY['칼로리 걱정됨'], ARRAY['딸기', '우유', '달콤'], false),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440000', 5, '블루베리 타르트의 정석', '진짜 블루베리 타르트를 먹는 듯한 달콤하고 새콤한 맛이 일품입니다. 디저트 계열 좋아하시는 분들께 강추!', ARRAY['진짜 블루베리맛', '디저트 같은 맛', '고급스러운 향'], ARRAY['가격이 조금 비쌈'], ARRAY['블루베리', '디저트', '프리미엄'], true);

-- 샘플 커뮤니티 게시글
INSERT INTO community_posts (title, content, category_id, author_id, author_name, views, likes, is_pinned, is_hot) VALUES
('나스티 쿠션맨 맛 후기 - 완전 대박!', '드디어 나스티 쿠션맨 액상을 써봤는데 정말 맛이 좋네요. 과일 맛이 진짜 진하고 목넘김도 부드러워서 계속 빨게 되더라고요.', (SELECT id FROM community_categories WHERE name = '제품후기'), '550e8400-e29b-41d4-a716-446655440000', '베이프러버', 1234, 42, true, true),
('액상 DIY 레시피 공유합니다', '오랫동안 연구한 DIY 레시피를 공유해요. PG/VG 비율은 30/70으로 하고 니코틴은 6mg으로 맞춰봤는데 정말 만족스러운 결과가 나왔어요.', (SELECT id FROM community_categories WHERE name = 'DIY/팁'), '550e8400-e29b-41d4-a716-446655440001', 'DIY마스터', 856, 28, false, true),
('초보자 질문 - 니코틴 함량 추천 부탁드려요', '담배를 끊으려고 전자담배를 시작하려는데 니코틴 함량을 얼마나 해야할지 모르겠어요. 하루에 한 갑 정도 피웠는데 몇 mg로 시작하는게 좋을까요?', (SELECT id FROM community_categories WHERE name = '질문/답변'), '550e8400-e29b-41d4-a716-446655440002', '금연도전자', 623, 15, false, false);

-- 초기 통계 업데이트 (트리거로 자동 계산되지만 초기값 설정)
UPDATE community_categories SET post_count = (SELECT COUNT(*) FROM community_posts WHERE category_id = community_categories.id);
