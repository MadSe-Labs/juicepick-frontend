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

-- 주의: users와 user_profiles는 Supabase Auth를 통한 회원가입으로 생성됩니다
-- auth.users → public.users → user_profiles (트리거 자동 생성)

-- 샘플 제품 데이터 (Mock 데이터에서 일부 추출)
INSERT INTO products (id, name, brand, description, price, original_price, discount_percentage, rating, review_count, image_url, image_urls, flavor, nicotine, volume, is_popular, is_new, in_stock) VALUES
('550e8400-e29b-41d4-a716-446655440100', '나스티 망고 아이스', '나스티', '망고의 달콤함과 시원한 아이스가 만나 완벽한 조화를 이루는 프리미엄 액상', 12000, 15000, 20, 4.8, 124, '/images/nasty-mango.jpg', ARRAY['/images/nasty-mango.jpg', '/images/nasty-mango-2.jpg', '/images/nasty-mango-3.jpg'], '망고 아이스', '3mg', '60ml', true, false, true),
('550e8400-e29b-41d4-a716-446655440101', '코스모스 스트로베리 밀크', '코스모스', '신선한 딸기와 부드러운 우유의 완벽한 조화', 8000, null, null, 4.6, 89, '/images/cosmos-strawberry.jpg', ARRAY['/images/cosmos-strawberry.jpg', '/images/cosmos-strawberry-2.jpg'], '스트로베리 밀크', '6mg', '30ml', false, true, true),
('550e8400-e29b-41d4-a716-446655440102', '맥스웰 블루베리 타르트', '맥스웰', '진짜 블루베리 타르트를 먹는 듯한 달콤하고 새콤한 맛', 13500, 16000, 15, 4.7, 156, '/images/maxwell-blueberry.jpg', ARRAY['/images/maxwell-blueberry.jpg', '/images/maxwell-blueberry-2.jpg', '/images/maxwell-blueberry-3.jpg'], '블루베리 타르트', '3mg', '60ml', true, false, true),
('550e8400-e29b-41d4-a716-446655440103', '더원 바닐라 크림', '더원', '부드럽고 진한 바닐라 크림의 깊은 맛', 9500, null, null, 4.4, 67, '/images/theone-vanilla.jpg', ARRAY['/images/theone-vanilla.jpg', '/images/theone-vanilla-2.jpg'], '바닐라 크림', '6mg', '30ml', false, false, false),
('550e8400-e29b-41d4-a716-446655440104', '나스티 그린애플', '나스티', '상큼한 그린애플의 깔끔하고 시원한 맛', 11000, null, null, 4.5, 78, '/images/nasty-greenapple.jpg', ARRAY['/images/nasty-greenapple.jpg'], '그린애플', '3mg', '60ml', false, true, true);

-- 주문, 리뷰, 커뮤니티 게시글 등은 회원가입 후 생성됩니다

-- 초기 통계 업데이트 (트리거로 자동 계산되지만 초기값 설정)
UPDATE community_categories SET post_count = (SELECT COUNT(*) FROM community_posts WHERE category_id = community_categories.id);
