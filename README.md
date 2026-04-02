# AlphaNote

습관 추적과 지식 공유를 하나로 통합한 풀스택 웹 플랫폼

---

## 프로젝트 소개

AlphaNote는 사용자가 매일의 습관을 기록·관리하고, Q&A 커뮤니티를 통해 지식을 공유할 수 있는 개인 학습 관리 웹 애플리케이션입니다.

---

## 주요 기능

### 습관 추적 (Habit Tracking)
- 습관 생성, 수정, 삭제, 보관
- 일일 습관 기록 및 메모
- 연간/월별 활동 캘린더 뷰
- 스트릭(연속 기록) 추적 및 통계
- 습관 검색 및 필터링 (이름, 상태, 날짜)

### 연간 목표 관리 (Yearly Goals)
- 연도별 목표 생성 및 관리
- 목표 항목(GoalItem) 단위 체크 토글
- 공개/비공개 목표 설정

### Q&A 커뮤니티
- 질문/답변 작성 (TipTap 리치 텍스트 에디터)
- 댓글 시스템 (질문/답변 각각)
- 태그 기반 분류 및 검색
- 추천/비추천 투표 시스템
- 조회수 추적

### 실시간 알림 (SSE)
- Server-Sent Events 기반 실시간 알림
- 알림 읽음 처리 및 일괄 읽음

### 사용자 관리
- 이메일 회원가입 (이메일 인증 코드 발송)
- 일반 로그인 + Google OAuth2 소셜 로그인
- JWT + HttpOnly 쿠키 기반 인증 (Refresh Token 자동 갱신)
- 비밀번호 찾기 및 재설정 (이메일 링크)
- 프로필 관리 (닉네임, 프로필 이미지)
- 계정 복구 및 탈퇴

### 파일 업로드
- AWS S3 Presigned URL 방식 이미지 업로드
- 프로필 이미지 관리

---

## 기술 스택

### Frontend
| 기술 | 버전 |
|------|------|
| React | 19.1 |
| Vite | 7.1 |
| React Router | v7.8 |
| Zustand | 상태 관리 |
| Styled Components | CSS-in-JS |
| TipTap | 리치 텍스트 에디터 |
| Axios | HTTP 클라이언트 |

### Backend
| 기술 | 버전 |
|------|------|
| Spring Boot | 3.4.8 |
| Java | 17 |
| Spring Data JPA | ORM |
| Spring Security | 보안 |
| Spring OAuth2 Client | 소셜 로그인 |
| jjwt | 0.12.3 |
| MySQL | 데이터베이스 |
| AWS S3 SDK | 파일 저장소 |
| Spring Mail + Thymeleaf | 이메일 발송 |

---

## 프로젝트 구조

```
alpha-note/
├── front/                          # React 프론트엔드
│   └── src/
│       ├── api/                    # API 서비스 레이어 (axios, config, services)
│       ├── components/             # 재사용 컴포넌트 (Header, Footer, Modal 등)
│       ├── pages/                  # 페이지 컴포넌트
│       │   ├── LoginPage/
│       │   ├── SignupPage/
│       │   ├── HabitPage/          # 습관 목록/생성/상세
│       │   ├── GoalPage/           # 연간 목표
│       │   ├── QnAPage/            # Q&A 질문/답변
│       │   ├── NotificationPage/
│       │   ├── ProfilePage/
│       │   ├── OAuth2RedirectPage/ # OAuth2 콜백 처리
│       │   └── ForgotPasswordPage/
│       ├── store/                  # Zustand 상태 (authStore, notificationStore)
│       └── styles/                 # 전역 스타일 및 테마
│
└── back/                           # Spring Boot 백엔드
    └── src/main/java/com/alpha_note/core/
        ├── auth/                   # 인증 (로그인, 회원가입, 이메일 인증, 비밀번호 재설정)
        ├── user/                   # 사용자 관리
        ├── habit/                  # 습관 추적
        ├── goal/                   # 연간 목표 관리
        ├── qna/                    # Q&A (질문, 답변, 댓글, 태그, 투표)
        ├── notification/           # SSE 실시간 알림
        ├── storage/                # AWS S3 파일 업로드
        ├── support/                # 문의하기
        ├── security/               # JWT 필터, OAuth2 핸들러
        └── config/                 # SecurityConfig, AwsS3Config 등
```

---

## 시작하기

### 사전 요구사항
- Java 17+
- Node.js (LTS)
- MySQL 8.0+
- AWS 계정 (S3 사용 시)
- Gmail 앱 비밀번호 (이메일 발송)
- Google Cloud OAuth2 클라이언트 (소셜 로그인)

---

### 백엔드 설정

**1. 데이터베이스 생성**
```sql
CREATE DATABASE alpha_note CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**2. `application-local.yml` 생성**

`back/src/main/resources/application-local.yml` 파일을 직접 생성합니다 (gitignore 제외 파일).

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/alpha_note
    username: your_db_username
    password: your_db_password
  jpa:
    hibernate:
      ddl-auto: create   # 최초 실행 시. 이후 update 또는 none으로 변경
  mail:
    host: smtp.gmail.com
    port: 587
    username: your_email@gmail.com
    password: your_gmail_app_password   # Gmail 앱 비밀번호
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enable: true
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: your_google_client_id
            client-secret: your_google_client_secret
            redirect-uri: http://localhost:8080/login/oauth2/code/google

jwt:
  secret: your_base64_encoded_jwt_secret   # 256비트 이상 랜덤 문자열을 Base64 인코딩

cloud:
  aws:
    credentials:
      access-key: your_aws_access_key
      secret-key: your_aws_secret_key
    region:
      static: ap-northeast-2
    s3:
      bucket: your_s3_bucket_name

app:
  cors:
    allowed-origins: http://localhost:3000
  cdn:
    base-url: https://your_cdn_or_s3_url
```

> **Gmail 앱 비밀번호 발급**: Google 계정 > 보안 > 2단계 인증 > 앱 비밀번호

> **Google OAuth2**: [Google Cloud Console](https://console.cloud.google.com/)에서 OAuth 2.0 클라이언트 ID 생성 후 리디렉션 URI에 `http://localhost:8080/login/oauth2/code/google` 추가

**3. 백엔드 실행**
```bash
cd back

# Mac/Linux
./gradlew bootRun --args='--spring.profiles.active=local'

# Windows
gradlew.bat bootRun --args='--spring.profiles.active=local'
```

---

### 프론트엔드 설정

**1. 의존성 설치**
```bash
cd front
npm install
```

**2. `.env` 파일 생성**
```bash
# front/.env
VITE_API_URL=http://localhost:8080
```

**3. 개발 서버 실행**
```bash
npm run dev
# → http://localhost:3000
```

---

## 개발 스크립트

### 프론트엔드
```bash
npm run dev          # 개발 서버 (포트 3000)
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
npm run lint         # ESLint 검사
npm run lint:fix     # ESLint 자동 수정
npm run format       # Prettier 포맷팅
```

### 백엔드
```bash
./gradlew bootRun    # 애플리케이션 실행
./gradlew build      # 빌드
./gradlew test       # 테스트 실행
```

---

## 인증 플로우

```
[이메일 로그인]
클라이언트 → POST /auth/login
← Access Token (응답 바디) + Refresh Token (HttpOnly Cookie)

[자동 갱신]
클라이언트 → POST /auth/refresh (쿠키 자동 포함)
← 새 Access Token

[Google OAuth2]
클라이언트 → /oauth2/authorization/google
← Google 인증 → 리디렉션 → 프론트 /oauth2/redirect?token=...
```

---

## 보안 유의사항

`application-local.yml` 및 `.env` 파일은 `.gitignore`로 제외되어 있어 커밋되지 않습니다.  
민감한 키(JWT Secret, AWS Key, OAuth2 Secret, Gmail 앱 비밀번호)는 절대 소스코드에 하드코딩하지 마세요.

자세한 로컬 설정 방법은 [`back/docs/LOCAL_SETUP_GUIDE.md`](back/docs/LOCAL_SETUP_GUIDE.md)를 참고하세요.
