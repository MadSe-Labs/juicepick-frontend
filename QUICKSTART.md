# 🚀 Quick Start Guide

새로운 팀원을 위한 빠른 시작 가이드입니다.

## ⚡ 10분 만에 시작하기

⚠️ **중요: 클라우드 Supabase를 사용하지 않고, 각자 로컬 환경에서 독립적으로 개발합니다!**

### 1. 저장소 클론

```bash
git clone <repository-url>
cd juicepick-frontend
```

### 2. 의존성 설치

```bash
pnpm install
```

### 3. Docker Desktop 설치 및 실행

- [Docker Desktop 다운로드](https://www.docker.com/products/docker-desktop/)
- 설치 후 Docker Desktop 실행
- 시스템 트레이에 Docker 아이콘 확인

### 4. Supabase CLI 설치

```bash
# macOS
brew install supabase/tap/supabase

# Windows
scoop install supabase

# 또는 npm
npm install -g supabase
```

### 5. Supabase 로컬 환경 시작

```bash
# Supabase 로컬 시작 (Docker 컨테이너)
supabase start

# ⏳ 처음 실행 시 1-2분 소요 (Docker 이미지 다운로드)

# ✅ 성공 시 Studio URL 확인: http://127.0.0.1:54323
```

**💡 참고:**

- Migration 파일이 자동으로 적용됩니다
- 샘플 데이터도 자동으로 생성됩니다
- 환경 변수 설정 불필요 (`.env.development`에 이미 설정됨)

### 6. 개발 서버 실행

```bash
pnpm dev
```

### 7. 브라우저 확인

- **개발 서버**: http://localhost:3000/main
- **Supabase Studio**: http://localhost:54323

---

## 🎯 체크리스트

시작 전 확인사항:

- [ ] Docker Desktop 실행 중
- [ ] `supabase start` 성공 (http://localhost:54323 접속 가능)
- [ ] `pnpm dev` 실행 중
- [ ] http://localhost:3000/main 접속 가능
- [ ] 상품 목록이 보임

---

## 📝 매일 시작 전 체크리스트

```bash
# 1. Docker Desktop 실행 확인

# 2. Supabase 시작
supabase start

# 3. 최신 코드 받기
git pull

# 4. 의존성 업데이트 확인 (package.json 변경 시)
pnpm install

# 5. 개발 서버 실행
pnpm dev
```

---

## 🔍 Supabase 로컬 환경 관리

```bash
# 상태 확인
supabase status

# 중지
supabase stop

# 재시작
supabase start

# DB 초기화 (주의: 모든 데이터 삭제!)
supabase db reset
```

---

## 🐛 자주 발생하는 문제

### 문제 1: `supabase: command not found`

**해결**: Supabase CLI 재설치

```bash
brew install supabase/tap/supabase
# 또는
npm install -g supabase
```

### 문제 2: `Cannot connect to the Docker daemon`

**해결**: Docker Desktop 실행

- Docker Desktop을 실행하세요
- 시스템 트레이에서 Docker 아이콘 확인

### 문제 3: `supabase start` 실패

**해결**: Docker 상태 확인 및 재시작

```bash
# Docker 프로세스 확인
docker ps

# Supabase 컨테이너 정리
supabase stop
docker system prune -a

# 재시작
supabase start
```

### 문제 4: Port 54321 이미 사용 중

**해결**: 기존 Supabase 중지

```bash
supabase stop
supabase start
```

### 문제 5: Port 3000 이미 사용 중

**해결**: 다른 포트로 실행

```bash
PORT=3001 pnpm dev
```

### 문제 6: 상품 목록이 안 보임

**해결**: Supabase Studio에서 데이터 확인

```bash
# 1. Studio 접속
open http://localhost:54323

# 2. Table Editor → products 확인
# 3. 데이터가 없으면 DB 초기화
supabase db reset
```

---

## 🆘 도움이 필요하면?

- 📚 [전체 README](./README.md) 참고
- 💬 팀 채널에서 질문
- 📧 팀 리더에게 연락

---

## 📌 중요한 것들

### 로컬 개발 환경의 특징

✅ **독립성**

- 각자의 로컬 DB 사용
- 팀원들과 독립적으로 개발
- 실험적인 변경 자유롭게 가능

✅ **데이터 보존**

- Docker 볼륨에 저장
- `supabase stop` 후에도 데이터 유지
- 컴퓨터 재시작 후에도 유지

✅ **자동화**

- Migration 자동 적용
- 샘플 데이터 자동 생성
- 환경 변수 자동 설정

❌ **제한사항**

- 팀원들과 DB 공유 불가
- 로컬에만 데이터 저장
- 인터넷 없이는 Git 동기화 불가

---

**Happy Coding! 🎉**
