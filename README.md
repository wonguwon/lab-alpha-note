# AlphaNote

습관 추적과 지식 공유를 하나로 통합한 웹 플랫폼

## 프로젝트 소개

AlphaNote는 사용자가 매일의 습관을 기록하고 관리하면서, 동시에 Q&A 커뮤니티를 통해 지식을 공유할 수 있는 풀스택 웹 애플리케이션입니다.

## 주요 기능

### 습관 추적 (Habit Tracking)
- 습관 생성 및 관리
- 일일 습관 기록
- 연간/월별 활동 캘린더 뷰
- 스트릭(연속 기록) 추적 및 통계
- 습관 검색 및 필터링

### Q&A 커뮤니티
- 질문/답변 작성 (리치 텍스트 에디터)
- 댓글 시스템
- 태그 기반 분류 및 검색
- 투표 시스템 (추천/비추천)
- 조회수 추적

### 사용자 관리
- 이메일 회원가입 및 로그인
- OAuth2 소셜 로그인 (Google)
- 프로필 관리 (닉네임, 프로필 이미지)
- 계정 복구 시스템

## 기술 스택

### Frontend
- React 19.1 + Vite 7.1
- React Router v7.8
- Zustand (상태 관리)
- Styled Components
- TipTap (리치 텍스트 에디터)
- Axios

### Backend
- Spring Boot 3.4.8
- Spring Data JPA
- Spring Security + OAuth2
- JWT (인증)
- MySQL
- AWS S3 (파일 저장소)
- Spring Mail

### 개발 환경
- Java 17
- Node.js (LTS)
- Gradle
- ESLint + Prettier

## 프로젝트 구조

```
alpha-note/
├── front/          # React 프론트엔드
│   ├── src/
│   │   ├── api/           # API 서비스 레이어
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── components/    # 재사용 컴포넌트
│   │   └── store/         # Zustand 상태 관리
│   └── package.json
│
└── back/           # Spring Boot 백엔드
    ├── src/main/java/com/alpha_note/core/
    │   ├── auth/          # 인증 기능
    │   ├── habit/         # 습관 추적
    │   ├── qna/           # Q&A 커뮤니티
    │   ├── user/          # 사용자 관리
    │   ├── security/      # 보안 설정
    │   └── storage/       # 파일 저장소
    └── build.gradle
```

## 시작하기

### 사전 요구사항
- Java 17
- Node.js (LTS)
- MySQL 8.0+
- AWS 계정 (S3 사용 시)

### 백엔드 설정

1. 데이터베이스 설정
```bash
# MySQL 데이터베이스 생성
mysql -u root -p
CREATE DATABASE alphanote;
```

2. 환경 변수 설정
```bash
# back/src/main/resources/application-local.yml 생성
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/alphanote
    username: your_username
    password: your_password

  mail:
    username: your_email@gmail.com
    password: your_app_password

  security:
    oauth2:
      client:
        registration:
          google:
            client-id: your_google_client_id
            client-secret: your_google_client_secret

jwt:
  secret: your_jwt_secret_key

aws:
  s3:
    bucket: your_s3_bucket_name
    region: ap-northeast-2
    access-key: your_aws_access_key
    secret-key: your_aws_secret_key
```

3. 백엔드 실행
```bash
cd back
./gradlew bootRun
```

### 프론트엔드 설정

1. 의존성 설치
```bash
cd front
npm install
```

2. 환경 변수 설정
```bash
# front/.env 생성
VITE_API_BASE_URL=http://localhost:8080
```

3. 개발 서버 실행
```bash
npm run dev
```

4. 빌드
```bash
npm run build
```

## 개발 스크립트

### 프론트엔드
```bash
npm run dev         # 개발 서버 실행
npm run build       # 프로덕션 빌드
npm run preview     # 빌드 미리보기
npm run lint        # 코드 검사
npm run lint:fix    # 코드 자동 수정
npm run format      # 코드 포맷팅
```

### 백엔드
```bash
./gradlew bootRun   # 애플리케이션 실행
./gradlew build     # 빌드
./gradlew test      # 테스트 실행
```
