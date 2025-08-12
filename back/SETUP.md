# Alpha Note Core 설정 가이드

## 📋 체크리스트

### 1. 데이터베이스 설정
- [ ] MySQL 8.0 이상 설치
- [ ] `alpha_note` 데이터베이스 생성
- [ ] application.properties에 DB 정보 입력

### 2. Google OAuth2.0 설정
- [ ] Google Cloud Console 프로젝트 생성
- [ ] OAuth2.0 클라이언트 ID 생성
- [ ] 리디렉션 URI 설정: `http://localhost:8080/oauth2/callback/google`
- [ ] application.properties에 Client ID/Secret 입력

### 3. 환경 설정
- [ ] Java 17 이상 설치
- [ ] Gradle 8.x 설치
- [ ] IDE 설정 (IntelliJ IDEA 권장)

## 🔧 상세 설정 가이드

### MySQL 데이터베이스 생성
```sql
-- 1. MySQL 접속
mysql -u root -p

-- 2. 데이터베이스 생성
CREATE DATABASE alpha_note CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. 사용자 생성 (선택사항)
CREATE USER 'alphanote_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON alpha_note.* TO 'alphanote_user'@'localhost';
FLUSH PRIVILEGES;

-- 4. 확인
SHOW DATABASES;
USE alpha_note;
```

### Google OAuth2.0 클라이언트 설정

#### 1. Google Cloud Console 설정
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스 > 라이브러리** 이동
4. **Google+ API** 검색 후 사용 설정

#### 2. OAuth2.0 클라이언트 ID 생성
1. **API 및 서비스 > 사용자 인증 정보** 이동
2. **사용자 인증 정보 만들기 > OAuth 클라이언트 ID** 클릭
3. 애플리케이션 유형: **웹 애플리케이션** 선택
4. 이름: `Alpha Note Core` (또는 원하는 이름)
5. 승인된 JavaScript 원본: `http://localhost:8080`
6. 승인된 리디렉션 URI: `http://localhost:8080/oauth2/callback/google`
7. **만들기** 클릭
8. 생성된 **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사

#### 3. 동의 화면 구성
1. **OAuth 동의 화면** 탭 이동
2. 사용자 유형: **외부** 선택 (개발/테스트용)
3. 필수 정보 입력:
   - 앱 이름: `Alpha Note`
   - 사용자 지원 이메일: 본인 이메일
   - 개발자 연락처 정보: 본인 이메일
4. 범위 추가: `email`, `profile`, `openid`
5. 테스트 사용자 추가 (개발 단계에서는 본인 계정 추가)

## 🚀 실행 및 테스트

### 1. 애플리케이션 실행
```bash
# 프로젝트 루트 디렉토리에서
./gradlew bootRun
```

### 2. 기본 기능 테스트

#### 일반 회원가입 테스트
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Google OAuth2.0 로그인 테스트
브라우저에서 접속:
```
http://localhost:8080/oauth2/authorize/google
```

## 🔍 문제 해결

### 자주 발생하는 문제

#### 1. MySQL 연결 오류
**해결방법:**
- MySQL 서비스가 실행 중인지 확인
- 포트 번호 확인 (기본: 3306)
- 방화벽 설정 확인

#### 2. Google OAuth2.0 오류
**해결방법:**
- Client ID/Secret이 정확한지 확인
- 리디렉션 URI가 정확히 설정되었는지 확인

---

**설정 완료 후 Alpha Note Core를 즐겨보세요! 🎉**
