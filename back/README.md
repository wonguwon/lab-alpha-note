# Alpha Note Core

> 간편하고 직관적인 노트 관리 백엔드 API with Google OAuth2.0

## 📖 프로젝트 소개

Alpha Note Core는 효율적인 노트 작성과 관리를 위한 Spring Boot 기반의 REST API 서버입니다.
사용자가 노트를 생성, 수정, 삭제하고 체계적으로 관리할 수 있는 백엔드 서비스를 제공합니다.

## 🛠 기술 스택

- **Java 17**
- **Spring Boot 3.4.8**
- **Spring Data JPA**
- **Spring Security + OAuth2.0**
- **JWT Authentication**
- **MySQL**
- **Gradle**
- **Lombok**

## 🔐 인증 시스템

### 지원하는 로그인 방식
1. **일반 로그인** - 이메일/비밀번호 기반
2. **Google OAuth2.0** - Google 계정 연동 로그인

## 🚀 시작하기

### 사전 요구사항

- Java 17 이상
- MySQL 8.0 이상
- Gradle 8.x
- Google OAuth2.0 클라이언트 ID/Secret (Google 로그인 사용 시)

### Google OAuth2.0 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스 > 사용자 인증 정보** 이동
4. **사용자 인증 정보 만들기 > OAuth 클라이언트 ID** 선택
5. 애플리케이션 유형: **웹 애플리케이션**
6. 승인된 리디렉션 URI 추가:
   ```
   http://localhost:8080/oauth2/callback/google
   ```
7. 생성된 클라이언트 ID와 클라이언트 Secret 복사

### 설치 및 실행

1. 프로젝트 클론
```bash
git clone [repository-url]
cd back
```

2. 데이터베이스 설정
```bash
# MySQL에서 데이터베이스 생성
CREATE DATABASE alpha_note;
```

3. 애플리케이션 설정
`src/main/resources/application.properties` 파일에서 설정 수정:
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/alpha_note
spring.datasource.username=your_username
spring.datasource.password=your_password

# OAuth2 Google Configuration (필수)
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET

# Frontend 리디렉션 URI (필요시 수정)
app.oauth2.authorized-redirect-uri=http://localhost:3000/oauth2/redirect
```

4. 애플리케이션 실행
```bash
./gradlew bootRun
```

서버가 성공적으로 시작되면 `http://localhost:8080`에서 접근 가능합니다.

## 📚 API 문서

### 인증 API (인증 불필요)

#### 일반 로그인/회원가입
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

#### Google OAuth2.0 로그인
- `GET /oauth2/authorize/google` - Google 로그인 시작
- `GET /oauth2/callback/google` - Google 로그인 콜백 (자동)

### 보호된 API (JWT 토큰 필요)
- `GET /api/test/protected` - 보호된 테스트
- `GET /api/test/user-info` - 사용자 정보

## 🏗 프로젝트 구조

```
src/
├── main/
│   ├── java/com/alpha_note/core/
│   │   ├── CoreApplication.java
│   │   ├── config/
│   │   │   └── SecurityConfig.java       # Spring Security + OAuth2 설정
│   │   ├── controller/
│   │   │   ├── AuthController.java       # 일반 인증 API
│   │   │   ├── OAuth2Controller.java     # OAuth2 관련 API
│   │   │   └── TestController.java       # 테스트 API
│   │   ├── dto/                          # 데이터 전송 객체
│   │   ├── entity/
│   │   │   ├── User.java                 # 사용자 엔티티
│   │   │   ├── Role.java                 # 역할 enum
│   │   │   └── AuthProvider.java         # 인증 제공자 enum
│   │   ├── repository/
│   │   │   └── UserRepository.java       # 사용자 데이터 접근
│   │   ├── security/
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   └── oauth2/                   # OAuth2 관련 클래스들
│   │   ├── service/
│   │   │   ├── AuthService.java          # 인증 비즈니스 로직
│   │   │   └── CustomUserDetailsService.java
│   │   └── util/
│   │       └── JwtUtil.java              # JWT 유틸리티
│   └── resources/
│       └── application.properties
└── test/
```

## 🔧 개발 환경

### 개발 도구 실행
```bash
# 개발 모드로 실행 (hot reload)
./gradlew bootRun

# 테스트 실행
./gradlew test

# 빌드
./gradlew build
```

## 🧪 사용 예시

### 1. 일반 회원가입
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. 일반 로그인
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### 3. Google OAuth2.0 로그인
브라우저에서 다음 URL 접속:
```
http://localhost:8080/oauth2/authorize/google
```

### 4. 보호된 API 호출
```bash
curl -X GET http://localhost:8080/api/test/protected \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📝 개발 계획

- [x] 사용자 인증/인가 시스템 (JWT)
- [x] Google OAuth2.0 로그인
- [ ] 노트 CRUD API 구현
- [ ] 카테고리/태그 시스템
- [ ] 검색 기능
- [ ] 파일 첨부 기능
- [ ] 리프레시 토큰 구현
- [ ] API 문서화 (Swagger)

## 🔒 보안 주의사항

1. **Google OAuth2.0 인증 정보**는 절대 공개 저장소에 커밋하지 마세요
2. **JWT Secret Key**는 충분히 복잡하게 설정하세요
3. **프로덕션 환경**에서는 HTTPS를 사용하세요
4. **데이터베이스 비밀번호**를 환경변수로 관리하세요

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

**Alpha Note Core** - 효율적인 노트 관리의 시작 🚀
