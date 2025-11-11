# QnA 기능 개발 가이드

## 📋 개요

회원들이 질문을 작성하고 서로 답변을 달 수 있는 QnA 커뮤니티 기능 개발

**개발 일자**: 2025-11-07
**브랜치**: `feat/qna`
**주요 기술**: Spring Boot 3.4.8, JPA/Hibernate, MySQL

---

## 🎯 주요 기능

### 1. 질문 (Question)
- 질문 작성/수정/삭제 (Soft Delete)
- 제목, 내용 (마크다운 지원)
- 태그 추가 (최대 5개)
- 이미지 임베드 (content에 마크다운 형식으로 S3 URL 삽입)
- 조회수, 추천수, 답변 수 자동 집계
- 답변 채택 기능 (질문 작성자만)

### 2. 답변 (Answer)
- 답변 작성/수정/삭제
- 채택 답변 표시
- 추천 기능 (UP only)
- 댓글 작성 가능

### 3. 댓글 (Comment)
- 질문/답변에 각각 댓글 작성 가능
- 짧은 의견 및 추가 질문용 (최대 500자)

### 4. 추천 (Vote)
- 질문/답변 각각 추천 가능
- 사용자당 1표 제한 (UP only)
- 중복 추천 방지 (UNIQUE 제약)

### 5. 태그 (Tag)
- 질문 분류 및 검색
- 자동 생성 (질문 작성 시)
- 인기 태그 (사용 횟수 기준)

### 6. 이미지 업로드 방식
- 프론트엔드에서 S3 presigned URL로 직접 업로드
- 업로드 완료 후 CloudFront CDN URL을 마크다운 형식으로 content에 삽입
- 형식: `![alt text](https://cdn.example.com/images/xxx.png)`
- 별도 첨부파일 테이블 없이 content 필드에 통합 관리

---

## 📊 데이터베이스 스키마

### ERD 관계도

```
User (기존)
  ↓
Question (1:N)
  ├── Answer (1:N)
  │   ├── AnswerComment (1:N)
  │   └── AnswerVote (1:N, UNIQUE constraint)
  ├── QuestionComment (1:N)
  ├── QuestionVote (1:N, UNIQUE constraint)
  └── QuestionTag (N:M via QuestionTag)
        ↓
      Tag
```

### 주요 테이블

#### 1. questions
```sql
- id (BIGINT, PK, AUTO_INCREMENT)
- user_id (BIGINT, FK to users)
- title (VARCHAR(255), NOT NULL)
- content (TEXT, NOT NULL)
- view_count (INT, DEFAULT 0)
- vote_count (INT, DEFAULT 0)
- answer_count (INT, DEFAULT 0)
- is_answered (BOOLEAN, DEFAULT FALSE)
- accepted_answer_id (BIGINT, NULLABLE)
- last_activity_at (TIMESTAMP)
- created_at, updated_at, is_deleted, deleted_at
```

#### 2. answers
```sql
- id (BIGINT, PK)
- question_id (BIGINT, FK, CASCADE)
- user_id (BIGINT, FK)
- content (TEXT, NOT NULL)
- vote_count (INT, DEFAULT 0)
- is_accepted (BOOLEAN, DEFAULT FALSE)
- created_at, updated_at, is_deleted, deleted_at
```

#### 3. tags
```sql
- id (BIGINT, PK)
- name (VARCHAR(50), UNIQUE, NOT NULL)
- description (TEXT)
- use_count (INT, DEFAULT 0)
- created_at, updated_at, is_deleted, deleted_at
```

#### 4. question_votes / answer_votes
```sql
- id (BIGINT, PK)
- question_id / answer_id (BIGINT, FK)
- user_id (BIGINT, FK)
- created_at
- UNIQUE(question_id/answer_id, user_id) -- 중복 방지
```

### 인덱스 전략
- FK 컬럼 전체 인덱싱
- `is_deleted` 컬럼 (Soft Delete 필터링)
- 정렬 컬럼: `created_at`, `vote_count`, `last_activity_at`
- UNIQUE 인덱스: vote 중복 방지, 태그명

---

## 🏗️ 아키텍처

### 패키지 구조
```
com.alpha_note.core.qna/
├── entity/              # 8개 엔티티
│   ├── Question.java
│   ├── Answer.java
│   ├── Tag.java
│   ├── QuestionTag.java
│   ├── QuestionComment.java
│   ├── AnswerComment.java
│   ├── QuestionVote.java
│   └── AnswerVote.java
│
├── repository/          # 8개 Repository
│   ├── QuestionRepository.java
│   ├── AnswerRepository.java
│   ├── TagRepository.java
│   ├── QuestionTagRepository.java
│   ├── QuestionCommentRepository.java
│   ├── AnswerCommentRepository.java
│   ├── QuestionVoteRepository.java
│   └── AnswerVoteRepository.java
│
├── service/             # 5개 Service
│   ├── QuestionService.java
│   ├── AnswerService.java
│   ├── CommentService.java
│   ├── VoteService.java
│   └── TagService.java
│
├── controller/          # 4개 Controller
│   ├── QuestionController.java
│   ├── AnswerController.java
│   ├── CommentController.java
│   └── VoteController.java
│
└── dto/
    ├── request/
    │   ├── CreateQuestionRequest.java
    │   ├── UpdateQuestionRequest.java
    │   ├── CreateAnswerRequest.java
    │   ├── UpdateAnswerRequest.java
    │   └── CreateCommentRequest.java
    └── response/
        ├── QuestionResponse.java
        ├── QuestionDetailResponse.java
        ├── AnswerResponse.java
        ├── CommentResponse.java
        └── TagResponse.java
```

### 설계 패턴

#### 1. Entity 패턴
```java
@Entity
@Table(name = "questions", indexes = {...})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Builder.Default
    private Boolean isDeleted = false;

    // 비즈니스 메소드
    public void incrementViewCount() { ... }
    public void markAsDeleted() { ... }
}
```

#### 2. Repository 패턴
```java
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    // Soft Delete 지원
    Optional<Question> findByIdAndIsDeletedFalse(Long id);
    Page<Question> findAllByIsDeletedFalse(Pageable pageable);

    // 커스텀 쿼리
    @Query("SELECT q FROM Question q WHERE ...")
    Page<Question> searchByKeyword(String keyword, Pageable pageable);
}
```

#### 3. Service 패턴
```java
@Slf4j
@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;

    @Transactional
    public QuestionDetailResponse createQuestion(Long userId, CreateQuestionRequest request) {
        // 비즈니스 로직
        // 로깅 (민감정보 마스킹)
        // DTO 변환
    }
}
```

#### 4. Controller 패턴
```java
@RestController
@RequestMapping("/api/v1/qna/questions")
@RequiredArgsConstructor
public class QuestionController {
    @PostMapping
    public ResponseEntity<ApiResponse<QuestionDetailResponse>> createQuestion(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateQuestionRequest request) {
        return ResponseEntity.ok(ApiResponse.success("메시지", response));
    }
}
```

---

## 🔌 API 명세

### Base URL
```
/api/v1/qna
```

### 1. 질문 API

#### 질문 작성
```http
POST /api/v1/qna/questions
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "질문 제목",
  "content": "질문 내용 (마크다운, 이미지 URL 포함 가능)",
  "tags": ["java", "spring", "jpa"]
}

Response 201:
{
  "success": true,
  "message": "질문이 성공적으로 작성되었습니다.",
  "data": {
    "id": 1,
    "userId": 123,
    "userNickname": "홍길동",
    "title": "...",
    "content": "...",
    "viewCount": 0,
    "voteCount": 0,
    "answerCount": 0,
    "isAnswered": false,
    "tags": [...],
    "comments": [],
    "answers": []
  }
}
```

#### 질문 목록 조회
```http
GET /api/v1/qna/questions?page=0&size=20&sort=lastActivityAt,desc

Response 200:
{
  "success": true,
  "message": "질문 목록 조회 성공",
  "data": {
    "content": [...],
    "totalElements": 100,
    "totalPages": 5,
    "number": 0,
    "size": 20
  }
}
```

#### 질문 상세 조회
```http
GET /api/v1/qna/questions/{id}

Response 200:
{
  "success": true,
  "data": {
    "id": 1,
    "title": "...",
    "content": "...",
    "viewCount": 42,
    "voteCount": 5,
    "isVotedByCurrentUser": true,
    "tags": [...],
    "comments": [...],
    "answers": [...]
  }
}
```

#### 질문 검색
```http
GET /api/v1/qna/questions/search?keyword=spring

Response 200: (페이징)
```

#### 태그별 질문 조회
```http
GET /api/v1/qna/questions/tag/{tagName}?page=0&size=20

Response 200: (페이징)
```

#### 미답변 질문 조회
```http
GET /api/v1/qna/questions/unanswered?page=0&size=20

Response 200: (페이징)
```

#### 질문 수정
```http
PUT /api/v1/qna/questions/{id}
Authorization: Bearer {token}

{
  "title": "수정된 제목",
  "content": "수정된 내용",
  "tags": ["java", "spring"]
}

Response 200:
```

#### 질문 삭제
```http
DELETE /api/v1/qna/questions/{id}
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "질문이 성공적으로 삭제되었습니다."
}
```

#### 답변 채택
```http
POST /api/v1/qna/questions/{questionId}/accept/{answerId}
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "답변이 채택되었습니다."
}
```

### 2. 답변 API

#### 답변 작성
```http
POST /api/v1/qna/questions/{questionId}/answers
Authorization: Bearer {token}

{
  "content": "답변 내용 (마크다운, 이미지 URL 포함 가능)"
}

Response 201:
```

#### 질문별 답변 목록
```http
GET /api/v1/qna/questions/{questionId}/answers

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "questionId": 1,
      "userId": 456,
      "userNickname": "김철수",
      "content": "...",
      "voteCount": 3,
      "isAccepted": true,
      "isVotedByCurrentUser": false,
      "comments": [...]
    }
  ]
}
```

#### 답변 수정
```http
PUT /api/v1/qna/answers/{answerId}
Authorization: Bearer {token}

{
  "content": "수정된 답변"
}

Response 200:
```

#### 답변 삭제
```http
DELETE /api/v1/qna/answers/{answerId}
Authorization: Bearer {token}

Response 200:
```

### 3. 추천 API

#### 질문 추천
```http
POST /api/v1/qna/questions/{questionId}/vote
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "질문 추천 완료"
}
```

#### 질문 추천 취소
```http
DELETE /api/v1/qna/questions/{questionId}/vote
Authorization: Bearer {token}

Response 200:
```

#### 답변 추천
```http
POST /api/v1/qna/answers/{answerId}/vote
Authorization: Bearer {token}

Response 200:
```

#### 답변 추천 취소
```http
DELETE /api/v1/qna/answers/{answerId}/vote
Authorization: Bearer {token}

Response 200:
```

#### 추천 여부 확인
```http
GET /api/v1/qna/questions/{questionId}/vote/check
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": true
}
```

### 4. 댓글 API

#### 질문 댓글 작성
```http
POST /api/v1/qna/questions/{questionId}/comments
Authorization: Bearer {token}

{
  "content": "댓글 내용 (최대 500자)"
}

Response 201:
```

#### 답변 댓글 작성
```http
POST /api/v1/qna/answers/{answerId}/comments
Authorization: Bearer {token}

{
  "content": "댓글 내용"
}

Response 201:
```

#### 댓글 목록 조회
```http
GET /api/v1/qna/questions/{questionId}/comments

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 789,
      "userNickname": "이영희",
      "content": "...",
      "createdAt": "2025-11-07T10:00:00Z"
    }
  ]
}
```

#### 댓글 수정
```http
PUT /api/v1/qna/comments/question/{commentId}
Authorization: Bearer {token}

{
  "content": "수정된 댓글"
}

Response 200:
```

#### 댓글 삭제
```http
DELETE /api/v1/qna/comments/question/{commentId}
Authorization: Bearer {token}

Response 200:
```

---

## 🔒 보안 및 권한

### 인증 (Authentication)
- JWT 토큰 기반 인증
- `@AuthenticationPrincipal User user`로 현재 사용자 정보 획득

### 권한 (Authorization)

#### 질문
- 작성: 로그인 필수
- 조회: 전체 공개 (비회원 가능)
- 수정: 본인만
- 삭제: 본인만
- 답변 채택: 질문 작성자만

#### 답변
- 작성: 로그인 필수
- 조회: 전체 공개
- 수정: 본인만
- 삭제: 본인만

#### 댓글/추천
- 작성: 로그인 필수
- 수정/삭제: 본인만

### 검증 규칙
```java
// Request DTO Validation
@NotBlank(message = "질문 제목은 필수입니다.")
@Size(max = 255, message = "제목은 최대 255자까지 입력 가능합니다.")
private String title;

@Size(max = 5, message = "태그는 최대 5개까지 추가할 수 있습니다.")
private List<String> tags;

@Size(max = 500, message = "댓글은 최대 500자까지 입력 가능합니다.")
private String content;
```

---

## 🎨 주요 기능 상세

### 1. Soft Delete 처리
모든 삭제는 논리적 삭제로 처리하여 데이터 복구 가능

```java
// Entity
@Column(name = "is_deleted", nullable = false)
@Builder.Default
private Boolean isDeleted = false;

@Column(name = "deleted_at")
private Instant deletedAt;

public void markAsDeleted() {
    this.isDeleted = true;
    this.deletedAt = Instant.now();
}

// Repository
Optional<Question> findByIdAndIsDeletedFalse(Long id);
Page<Question> findAllByIsDeletedFalse(Pageable pageable);

// Service - Cascade Soft Delete
private void softDeleteRelatedEntities(Long questionId) {
    // 답변들 Soft Delete
    List<Answer> answers = answerRepository.findByQuestionIdAndIsDeletedFalse(questionId);
    answers.forEach(answer -> {
        answer.markAsDeleted();
        answerRepository.save(answer);
    });
    // 댓글도 동일하게 처리
}
```

### 2. 투표 중복 방지
UNIQUE 제약조건으로 사용자당 1표 제한

```sql
-- Database
UNIQUE KEY uk_question_user_vote (question_id, user_id)

-- Service
if (questionVoteRepository.existsByQuestionIdAndUserId(questionId, userId)) {
    throw new CustomException(ErrorCode.VOTE_ALREADY_EXISTS);
}
```

### 3. 캐싱 필드
실시간 집계 대신 캐싱으로 성능 최적화

```java
// Question Entity
@Column(name = "view_count", nullable = false)
@Builder.Default
private Integer viewCount = 0;

@Column(name = "vote_count", nullable = false)
@Builder.Default
private Integer voteCount = 0;

@Column(name = "answer_count", nullable = false)
@Builder.Default
private Integer answerCount = 0;

// Service - 동기화
public void voteQuestion(Long questionId, Long userId) {
    questionVoteRepository.save(vote);
    question.incrementVoteCount();  // 캐시 업데이트
    questionRepository.save(question);
}
```

### 4. 답변 채택
질문 작성자만 답변을 채택할 수 있으며, 1개만 채택 가능

```java
// 권한 검증
if (!question.isOwnedBy(userId)) {
    throw new CustomException(ErrorCode.ONLY_QUESTION_AUTHOR_CAN_ACCEPT);
}

// 기존 채택 취소
if (question.hasAcceptedAnswer()) {
    Answer previousAccepted = answerRepository.findById(question.getAcceptedAnswerId()).orElse(null);
    if (previousAccepted != null) {
        previousAccepted.unmarkAsAccepted();
    }
}

// 새 답변 채택
question.acceptAnswer(answerId);
answer.markAsAccepted();
```

### 5. 태그 자동 생성
질문 작성 시 태그가 없으면 자동 생성

```java
Tag tag = tagRepository.findByNameAndIsDeletedFalse(tagName)
    .orElseGet(() -> {
        Tag newTag = Tag.builder()
                .name(tagName)
                .build();
        return tagRepository.save(newTag);
    });

// 사용 횟수 증가
tag.incrementUseCount();
tagRepository.save(tag);
```

### 6. 마지막 활동 시간 추적
질문/답변/댓글 작성 시 자동 업데이트

```java
@Column(name = "last_activity_at", nullable = false)
@Builder.Default
private Instant lastActivityAt = Instant.now();

public void updateLastActivity() {
    this.lastActivityAt = Instant.now();
}

// Service
question.updateLastActivity();
questionRepository.save(question);
```

---

## 🚀 배포 가이드

### 1. 데이터베이스 스키마 적용
```bash
# MySQL 접속
mysql -u root -p alpha_note

# 스키마 적용
source src/main/resources/db/schema/qna_schema.sql;

# 또는
mysql -u root -p alpha_note < src/main/resources/db/schema/qna_schema.sql
```

### 2. 빌드
```bash
# 빌드
./gradlew clean build

# 빌드 (테스트 스킵)
./gradlew clean build -x test
```

### 3. 실행
```bash
# 개발 환경
./gradlew bootRun

# 프로덕션 (JAR 실행)
java -jar build/libs/alpha-note-0.0.1-SNAPSHOT.jar
```

### 4. 초기 데이터 (선택)
```sql
-- 기본 태그 삽입
INSERT INTO tags (name, description) VALUES
('java', 'Java 프로그래밍 언어 관련 질문'),
('spring', 'Spring Framework 관련 질문'),
('mysql', 'MySQL 데이터베이스 관련 질문'),
('jpa', 'JPA/Hibernate ORM 관련 질문'),
('react', 'React.js 프론트엔드 관련 질문');
```

---

## 🐛 에러 코드

### QnA 관련 에러 (Q001~Q014)

| 코드 | HTTP Status | 메시지 |
|------|-------------|--------|
| Q001 | 404 NOT_FOUND | 질문을 찾을 수 없습니다. |
| Q002 | 403 FORBIDDEN | 질문에 접근할 권한이 없습니다. |
| Q003 | 404 NOT_FOUND | 답변을 찾을 수 없습니다. |
| Q004 | 403 FORBIDDEN | 답변에 접근할 권한이 없습니다. |
| Q005 | 404 NOT_FOUND | 댓글을 찾을 수 없습니다. |
| Q006 | 403 FORBIDDEN | 댓글에 접근할 권한이 없습니다. |
| Q007 | 404 NOT_FOUND | 태그를 찾을 수 없습니다. |
| Q008 | 409 CONFLICT | 이미 추천한 게시물입니다. |
| Q009 | 404 NOT_FOUND | 추천 기록을 찾을 수 없습니다. |
| Q010 | 409 CONFLICT | 이미 채택된 답변이 있습니다. |
| Q011 | 403 FORBIDDEN | 질문 작성자만 답변을 채택할 수 있습니다. |
| Q012 | 400 BAD_REQUEST | 해당 질문의 답변이 아닙니다. |
| Q013 | 409 CONFLICT | 이미 존재하는 태그입니다. |
| Q014 | 400 BAD_REQUEST | 태그는 최대 5개까지 추가할 수 있습니다. |

---

## ✅ TODO / 향후 개선사항

### 필수
- [ ] 데이터베이스 스키마 적용
- [ ] 빌드 테스트
- [ ] API 통합 테스트
- [ ] 프론트엔드 마크다운 에디터 이미지 업로드 연동

### 기능 개선
- [ ] 답변 정렬 옵션 추가 (최신순, 추천순, 채택 우선)
- [ ] 질문 필터링 (답변 여부, 채택 여부, 날짜 범위)
- [ ] 전체 검색 (제목+내용+태그 통합)
- [ ] 댓글 페이징 (댓글이 많을 경우)
- [ ] 사용자 통계 (작성한 질문/답변 수, 받은 추천 수, 채택 답변 수)
- [ ] 알림 기능 (답변 작성, 댓글, 채택, 추천 시)
- [ ] 신고 시스템
- [ ] 관리자 기능 (질문/답변 숨김, 태그 관리)

### 성능 최적화
- [ ] N+1 문제 해결 (fetch join)
- [ ] 쿼리 성능 최적화
- [ ] Redis 캐싱 (인기 질문, 태그)
- [ ] 전문 검색 (Elasticsearch)

### 보안
- [ ] XSS 방지 (마크다운 sanitize)
- [ ] Rate Limiting (질문/답변 작성 제한)
- [ ] 스팸 방지

---

## 📚 참고 자료

### 프로젝트 구조
- 기존 User 모듈 패턴 참고
- Soft Delete 패턴 적용
- JWT 인증 (`@AuthenticationPrincipal User user`)
- `ApiResponse<T>` 통일된 응답 형식

### 코딩 컨벤션
- Entity: `@CreationTimestamp`, `@UpdateTimestamp` 사용
- Enum: `@Enumerated(EnumType.STRING)` 사용
- Repository: Soft Delete 쿼리 제공 (`findByIdAndIsDeletedFalse`)
- Service: `@Transactional`, 로깅 (`log.info`), 민감정보 마스킹
- Controller: `@Valid` 검증, `ApiResponse.success()` 반환

### 데이터베이스
- MySQL 8.0
- UTF-8mb4 (이모지 지원)
- Timezone: UTC
- JPA DDL: `validate` (수동 스키마 관리)

---

## 🎯 테스트 시나리오

### 1. 질문 작성 플로우
1. 로그인
2. POST `/api/v1/qna/questions` - 질문 작성
3. 태그 자동 생성 확인
4. GET `/api/v1/qna/questions/{id}` - 상세 조회
5. 조회수 증가 확인

### 2. 답변 & 채택 플로우
1. 다른 사용자로 로그인
2. POST `/api/v1/qna/questions/{id}/answers` - 답변 작성
3. 질문 작성자로 로그인
4. POST `/api/v1/qna/questions/{id}/accept/{answerId}` - 채택
5. `is_answered` 플래그 확인

### 3. 추천 플로우
1. POST `/api/v1/qna/questions/{id}/vote` - 추천
2. `vote_count` 증가 확인
3. POST `/api/v1/qna/questions/{id}/vote` - 중복 추천 (409 Error)
4. DELETE `/api/v1/qna/questions/{id}/vote` - 추천 취소
5. `vote_count` 감소 확인

### 4. Soft Delete 플로우
1. DELETE `/api/v1/qna/questions/{id}` - 질문 삭제
2. `is_deleted = true` 확인
3. GET `/api/v1/qna/questions/{id}` - 404 Error
4. DB 직접 조회 시 데이터 존재 확인

---

## 📞 문의

개발자: Claude Code
일자: 2025-11-07
브랜치: `feat/qna`

---

**Generated with Claude Code**
