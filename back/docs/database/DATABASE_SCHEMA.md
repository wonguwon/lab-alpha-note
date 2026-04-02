# Alpha-Note 데이터베이스 스키마 문서

> 최종 업데이트: 2026-02-02
> 총 테이블 수: 21개

---

## 목차

1. [도메인 개요](#1-도메인-개요)
2. [ERD](#2-erd)
3. [테이블 상세](#3-테이블-상세)
   - [USER 도메인](#31-user-도메인)
   - [AUTH 도메인](#32-auth-도메인)
   - [QnA 도메인](#33-qna-도메인)
   - [HABIT 도메인](#34-habit-도메인)
   - [GROWTH_LOG 도메인](#35-growth_log-도메인)
   - [GOAL 도메인](#36-goal-도메인)
   - [COMMON 도메인](#37-common-도메인)
   - [NOTIFICATION 도메인](#38-notification-도메인)
4. [공통 패턴](#4-공통-패턴)
5. [Enum 정의](#5-enum-정의)

---

## 1. 도메인 개요

| 도메인 | 테이블 수 | 주요 기능 |
|--------|----------|----------|
| USER | 1 | 사용자 관리 |
| AUTH | 2 | 인증 (RefreshToken, 이메일 인증) |
| QnA | 8 | 질문, 답변, 댓글, 투표, 태그, 조회 |
| HABIT | 2 | 습관 추적 및 기록 |
| GROWTH_LOG | 5 | 성장기록, 댓글, 투표, 태그, 조회 |
| GOAL | 1 | 연도별 목표 관리 |
| COMMON | 1 | 공통 태그 |
| NOTIFICATION | 1 | 알림 |

---

## 2. ERD

> ERD 다이어그램은 [ERD.md](./ERD.md) 파일을 참조하세요.

### 핵심 관계 요약

```
User (1) ──────< (N) RefreshToken
User (1) ──────< (N) Question
User (1) ──────< (N) Answer
User (1) ──────< (N) Habit
User (1) ──────< (N) GrowthLog
User (1) ──────< (N) Notification
User (1) ──────< (N) YearlyGoal

Question (1) ──────< (N) Answer
Question (1) ──────< (N) QuestionComment
Question (1) ──────< (N) QuestionVote
Question (1) ──────< (N) QuestionTag >──────(1) Tag
Question (1) ──────< (N) QuestionView

Answer (1) ──────< (N) AnswerComment
Answer (1) ──────< (N) AnswerVote

GrowthLog (1) ──────< (N) GrowthLogComment
GrowthLog (1) ──────< (N) GrowthLogVote
GrowthLog (1) ──────< (N) GrowthLogTag >──────(1) Tag
GrowthLog (1) ──────< (N) GrowthLogView

Habit (1) ──────< (N) HabitRecord
```

---

## 3. 테이블 상세

### 3.1 USER 도메인

#### users

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| nickname | VARCHAR(255) | YES | | 닉네임 |
| email | VARCHAR(255) | NO | | 이메일 (UNIQUE) |
| password | VARCHAR(255) | YES | | 비밀번호 (OAuth2 사용자는 NULL) |
| role | VARCHAR(255) | YES | | 역할 (USER, ADMIN) |
| provider | VARCHAR(255) | YES | | 인증 제공자 (LOCAL, GOOGLE, KAKAO, NAVER) |
| provider_id | VARCHAR(255) | YES | | 소셜 로그인 ID |
| profile_image_url | VARCHAR(255) | YES | | 프로필 이미지 URL |
| email_subscribed | BOOLEAN | YES | FALSE | 이메일 구독 여부 |
| account_locked | BOOLEAN | YES | FALSE | 계정 잠금 여부 |
| password_expired_at | TIMESTAMP | YES | | 비밀번호 만료일 |
| last_password_reset_at | TIMESTAMP | YES | | 마지막 비밀번호 변경일 |
| is_deleted | BOOLEAN | YES | FALSE | 탈퇴 여부 (Soft Delete) |
| deleted_at | TIMESTAMP | YES | | 탈퇴 처리일 |
| deletion_scheduled_at | TIMESTAMP | YES | | 완전 삭제 예정일 |
| deletion_reason | VARCHAR(500) | YES | | 탈퇴 사유 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |
| updated_at | TIMESTAMP | YES | | 수정일 |

**제약조건:**
- `email` UNIQUE

---

### 3.2 AUTH 도메인

#### refresh_tokens

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| user_id | BIGINT | NO | | FK → users.id |
| token | VARCHAR(500) | NO | | 리프레시 토큰 (UNIQUE) |
| expires_at | TIMESTAMP | YES | | 만료일 |
| last_used_at | TIMESTAMP | YES | | 마지막 사용일 |
| is_revoked | BOOLEAN | YES | FALSE | 폐기 여부 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |

**인덱스:**
- `idx_token` (token)
- `idx_user_id` (user_id)
- `idx_expires_at` (expires_at)

---

#### email_verifications

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| email | VARCHAR(255) | NO | | 이메일 |
| code | VARCHAR(6) | NO | | 인증 코드 |
| verified | BOOLEAN | YES | FALSE | 인증 완료 여부 |
| attempt_count | INT | YES | 0 | 시도 횟수 |
| expires_at | TIMESTAMP | NO | | 만료일 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |

**인덱스:**
- `idx_email_verified` (email, verified)
- `idx_expires_at` (expires_at)

---

### 3.3 QnA 도메인

#### questions

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| user_id | BIGINT | NO | | FK → users.id |
| title | VARCHAR(255) | NO | | 제목 |
| content | TEXT | NO | | 내용 |
| category | VARCHAR(255) | YES | TECH | 카테고리 |
| view_count | INT | YES | 0 | 조회수 |
| vote_count | INT | YES | 0 | 투표수 |
| answer_count | INT | YES | 0 | 답변수 |
| is_answered | BOOLEAN | YES | FALSE | 답변 채택 여부 |
| accepted_answer_id | BIGINT | YES | | 채택된 답변 ID |
| last_activity_at | TIMESTAMP | YES | | 마지막 활동일 |
| is_deleted | BOOLEAN | YES | FALSE | 삭제 여부 |
| deleted_at | TIMESTAMP | YES | | 삭제일 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |
| updated_at | TIMESTAMP | YES | | 수정일 |

**인덱스:**
- `idx_user_id` (user_id)
- `idx_is_deleted` (is_deleted)
- `idx_created_at` (created_at)
- `idx_vote_count` (vote_count)
- `idx_last_activity_at` (last_activity_at)
- `idx_is_answered` (is_answered)
- `idx_accepted_answer_id` (accepted_answer_id)
- `idx_category` (category)

---

#### answers

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| question_id | BIGINT | NO | | FK → questions.id |
| user_id | BIGINT | NO | | FK → users.id |
| content | TEXT | NO | | 내용 |
| vote_count | INT | YES | 0 | 투표수 |
| is_accepted | BOOLEAN | YES | FALSE | 채택 여부 |
| is_deleted | BOOLEAN | YES | FALSE | 삭제 여부 |
| deleted_at | TIMESTAMP | YES | | 삭제일 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |
| updated_at | TIMESTAMP | YES | | 수정일 |

**인덱스:**
- `idx_question_id` (question_id)
- `idx_user_id` (user_id)
- `idx_is_deleted` (is_deleted)
- `idx_is_accepted` (is_accepted)
- `idx_vote_count` (vote_count)
- `idx_created_at` (created_at)

---

#### question_comments

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| question_id | BIGINT | NO | | FK → questions.id |
| user_id | BIGINT | NO | | FK → users.id |
| content | TEXT | NO | | 내용 |
| is_deleted | BOOLEAN | YES | FALSE | 삭제 여부 |
| deleted_at | TIMESTAMP | YES | | 삭제일 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |
| updated_at | TIMESTAMP | YES | | 수정일 |

**인덱스:**
- `idx_question_id` (question_id)
- `idx_user_id` (user_id)
- `idx_is_deleted` (is_deleted)
- `idx_created_at` (created_at)

---

#### answer_comments

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| answer_id | BIGINT | NO | | FK → answers.id |
| user_id | BIGINT | NO | | FK → users.id |
| content | TEXT | NO | | 내용 |
| is_deleted | BOOLEAN | YES | FALSE | 삭제 여부 |
| deleted_at | TIMESTAMP | YES | | 삭제일 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |
| updated_at | TIMESTAMP | YES | | 수정일 |

**인덱스:**
- `idx_answer_id` (answer_id)
- `idx_user_id` (user_id)
- `idx_is_deleted` (is_deleted)
- `idx_created_at` (created_at)

---

#### question_votes

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| question_id | BIGINT | NO | | FK → questions.id |
| user_id | BIGINT | NO | | FK → users.id |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |

**제약조건:**
- `uk_question_user_vote` UNIQUE (question_id, user_id)

**인덱스:**
- `idx_user_id` (user_id)

---

#### answer_votes

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| answer_id | BIGINT | NO | | FK → answers.id |
| user_id | BIGINT | NO | | FK → users.id |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |

**제약조건:**
- `uk_answer_user_vote` UNIQUE (answer_id, user_id)

**인덱스:**
- `idx_user_id` (user_id)

---

#### question_tags

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| question_id | BIGINT | NO | | FK → questions.id |
| tag_id | BIGINT | NO | | FK → tags.id |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |

**제약조건:**
- `uk_question_tag` UNIQUE (question_id, tag_id)

**인덱스:**
- `idx_tag_id` (tag_id)

---

#### question_views

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| question_id | BIGINT | NO | | PK, FK → questions.id |
| user_id | BIGINT | NO | | PK, FK → users.id |
| viewed_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 조회일 |

**복합 PK:** (question_id, user_id)

**인덱스:**
- `idx_user_id` (user_id)
- `idx_viewed_at` (viewed_at)

---

### 3.4 HABIT 도메인

#### habits

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| user_id | BIGINT | NO | | FK → users.id |
| title | VARCHAR(100) | NO | | 제목 |
| description | TEXT | YES | | 설명 |
| color | VARCHAR(7) | YES | #10B981 | 색상 코드 |
| target_count | INT | YES | 1 | 목표 횟수 |
| start_date | DATE | NO | | 시작일 |
| end_date | DATE | YES | | 종료일 |
| current_streak | INT | YES | 0 | 현재 연속 일수 |
| longest_streak | INT | YES | 0 | 최장 연속 일수 |
| total_records | INT | YES | 0 | 총 기록 수 |
| status | VARCHAR(255) | YES | ACTIVE | 상태 (ACTIVE, PAUSED, COMPLETED, DELETED) |
| deleted_at | TIMESTAMP | YES | | 삭제일 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |
| updated_at | TIMESTAMP | YES | | 수정일 |

**인덱스:**
- `idx_user_id` (user_id)
- `idx_status` (status)
- `idx_created_at` (created_at)

---

#### habit_records

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| habit_id | BIGINT | NO | | FK → habits.id |
| user_id | BIGINT | NO | | FK → users.id |
| record_date | DATE | NO | | 기록일 |
| logged_at | TIMESTAMP | YES | CURRENT_TIMESTAMP | 기록 시각 |
| count | INT | YES | 1 | 횟수 |
| note | TEXT | YES | | 메모 |
| is_deleted | BOOLEAN | YES | FALSE | 삭제 여부 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |
| updated_at | TIMESTAMP | YES | | 수정일 |

**인덱스:**
- `idx_habit_id` (habit_id)
- `idx_user_id` (user_id)
- `idx_record_date` (record_date)
- `idx_is_deleted` (is_deleted)
- `idx_habit_date` (habit_id, record_date)

---

### 3.5 GROWTH_LOG 도메인

#### growth_logs

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| user_id | BIGINT | NO | | FK → users.id |
| title | VARCHAR(100) | NO | | 제목 |
| content | TEXT | NO | | 내용 |
| thumbnail_url | VARCHAR(1000) | YES | | 썸네일 URL |
| status | VARCHAR(255) | YES | PUBLISHED | 상태 (DRAFT, PUBLISHED, ARCHIVED) |
| visibility | VARCHAR(255) | YES | PUBLIC | 공개 범위 (PUBLIC, PRIVATE) |
| view_count | INT | YES | 0 | 조회수 |
| vote_count | INT | YES | 0 | 투표수 |
| last_activity_at | TIMESTAMP | YES | | 마지막 활동일 |
| is_deleted | BOOLEAN | YES | FALSE | 삭제 여부 |
| deleted_at | TIMESTAMP | YES | | 삭제일 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |
| updated_at | TIMESTAMP | YES | | 수정일 |

**인덱스:**
- `idx_user_id` (user_id)
- `idx_is_deleted` (is_deleted)
- `idx_created_at` (created_at)
- `idx_vote_count` (vote_count)
- `idx_status_visibility` (status, visibility)

---

#### growth_log_comments

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| growth_log_id | BIGINT | NO | | FK → growth_logs.id |
| user_id | BIGINT | NO | | FK → users.id |
| content | TEXT | NO | | 내용 |
| is_deleted | BOOLEAN | YES | FALSE | 삭제 여부 |
| deleted_at | TIMESTAMP | YES | | 삭제일 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |
| updated_at | TIMESTAMP | YES | | 수정일 |

**인덱스:**
- `idx_growth_log_id` (growth_log_id)
- `idx_user_id` (user_id)
- `idx_is_deleted` (is_deleted)
- `idx_created_at` (created_at)

---

#### growth_log_votes

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| growth_log_id | BIGINT | NO | | FK → growth_logs.id |
| user_id | BIGINT | NO | | FK → users.id |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |

**제약조건:**
- `uk_growth_log_user_vote` UNIQUE (growth_log_id, user_id)

**인덱스:**
- `idx_user_id` (user_id)

---

#### growth_log_tags

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| growth_log_id | BIGINT | NO | | FK → growth_logs.id |
| tag_id | BIGINT | NO | | FK → tags.id |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |

**제약조건:**
- `uk_growth_log_tag` UNIQUE (growth_log_id, tag_id)

**인덱스:**
- `idx_tag_id` (tag_id)

---

#### growth_log_views

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| growth_log_id | BIGINT | NO | | PK, FK → growth_logs.id |
| user_id | BIGINT | NO | | PK, FK → users.id |
| viewed_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 조회일 |

**복합 PK:** (growth_log_id, user_id)

**인덱스:**
- `idx_user_id` (user_id)
- `idx_viewed_at` (viewed_at)

---

### 3.6 GOAL 도메인

#### yearly_goals

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| user_id | BIGINT | NO | | FK → users.id |
| year | INT | NO | | 연도 |
| goals | JSON | YES | | 목표 목록 (GoalItem 배열) |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |
| updated_at | TIMESTAMP | YES | | 수정일 |

**제약조건:**
- `uk_user_year` UNIQUE (user_id, year)

**인덱스:**
- `idx_user_id` (user_id)
- `idx_year` (year)
- `idx_user_year` (user_id, year)

---

### 3.7 COMMON 도메인

#### tags

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| name | VARCHAR(50) | NO | | 태그명 (UNIQUE) |
| description | TEXT | YES | | 설명 |
| use_count | INT | YES | 0 | 사용 횟수 |
| is_deleted | BOOLEAN | YES | FALSE | 삭제 여부 |
| deleted_at | TIMESTAMP | YES | | 삭제일 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |
| updated_at | TIMESTAMP | YES | | 수정일 |

**제약조건:**
- `name` UNIQUE

**인덱스:**
- `idx_name` (name)
- `idx_is_deleted` (is_deleted)
- `idx_use_count` (use_count)

---

### 3.8 NOTIFICATION 도메인

#### notifications

| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | NO | AUTO_INCREMENT | PK |
| user_id | BIGINT | NO | | FK → users.id |
| type | VARCHAR(50) | YES | | 알림 타입 |
| title | VARCHAR(200) | NO | | 제목 |
| content | TEXT | NO | | 내용 |
| related_entity_type | VARCHAR(50) | YES | | 관련 엔티티 타입 |
| related_entity_id | BIGINT | YES | | 관련 엔티티 ID |
| is_read | BOOLEAN | YES | FALSE | 읽음 여부 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성일 |

**인덱스:**
- `idx_user_id_is_read` (user_id, is_read)
- `idx_created_at` (created_at)
- `idx_user_id` (user_id)

---

## 4. 공통 패턴

### 4.1 Soft Delete 패턴
대부분의 엔티티에서 물리적 삭제 대신 논리적 삭제를 사용합니다.

| 필드 | 타입 | 설명 |
|------|------|------|
| is_deleted | BOOLEAN | 삭제 여부 (기본값: FALSE) |
| deleted_at | TIMESTAMP | 삭제 처리 시각 |

### 4.2 Audit 패턴
모든 엔티티에 생성/수정 시각을 기록합니다.

| 필드 | 타입 | 설명 |
|------|------|------|
| created_at | TIMESTAMP | 생성 시각 (자동 설정, 수정 불가) |
| updated_at | TIMESTAMP | 수정 시각 (자동 갱신) |

### 4.3 통계 캐싱 패턴
자주 조회되는 통계 값을 엔티티에 캐싱합니다.

**Question/Answer/GrowthLog:**
- view_count, vote_count, answer_count

**Habit:**
- current_streak, longest_streak, total_records

---

## 5. Enum 정의

### Role (사용자 역할)
| 값 | 설명 |
|----|------|
| USER | 일반 사용자 |
| ADMIN | 관리자 |

### AuthProvider (인증 제공자)
| 값 | 설명 |
|----|------|
| LOCAL | 자체 회원가입 |
| GOOGLE | Google OAuth2 |
| KAKAO | Kakao OAuth2 |
| NAVER | Naver OAuth2 |

### QuestionCategory (질문 카테고리)
| 값 | 설명 |
|----|------|
| TECH | 기술 |
| CAREER | 커리어 |
| LIFE | 일상 |
| OTHER | 기타 |

### HabitStatus (습관 상태)
| 값 | 설명 |
|----|------|
| ACTIVE | 활성 |
| PAUSED | 일시중지 |
| COMPLETED | 완료 |
| DELETED | 삭제됨 |

### GrowthLogStatus (성장기록 상태)
| 값 | 설명 |
|----|------|
| DRAFT | 임시저장 |
| PUBLISHED | 게시됨 |
| ARCHIVED | 보관됨 |

### GrowthLogVisibility (공개 범위)
| 값 | 설명 |
|----|------|
| PUBLIC | 공개 |
| PRIVATE | 비공개 |

### NotificationType (알림 타입)
| 값 | 설명 |
|----|------|
| ANSWER | 답변 알림 |
| COMMENT | 댓글 알림 |
| VOTE | 투표 알림 |
| ACCEPT | 답변 채택 알림 |
| SYSTEM | 시스템 알림 |

---

## 관련 문서

- [ERD 다이어그램](./ERD.md)
- [MySQL DDL 스크립트](./ddl/schema.sql)
