# Alpha-Note 데이터베이스 문서

> 최종 업데이트: 2026-02-02

## 문서 구조

```
docs/database/
├── README.md                 # 이 파일 (문서 인덱스)
├── DATABASE_SCHEMA.md        # 테이블 구조 상세 문서
├── ERD.md                    # ERD 다이어그램 (Mermaid)
└── ddl/
    ├── README.md             # DDL 사용 가이드
    └── schema.sql            # MySQL DDL 스크립트
```

## 빠른 링크

| 문서 | 설명 |
|------|------|
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | 전체 테이블 구조, 컬럼 정의, 인덱스 |
| [ERD.md](./ERD.md) | Mermaid 기반 ERD 다이어그램 |
| [ddl/schema.sql](./ddl/schema.sql) | MySQL 테이블 생성 스크립트 |

## 데이터베이스 개요

| 항목 | 값 |
|------|-----|
| DBMS | MySQL 8.0+ |
| 문자셋 | utf8mb4 |
| Collation | utf8mb4_unicode_ci |
| 총 테이블 수 | 21개 |

## 도메인 구성

| 도메인 | 테이블 | 핵심 기능 |
|--------|--------|----------|
| **USER** | users | 사용자 관리, OAuth2 지원 |
| **AUTH** | refresh_tokens, email_verifications | 인증 토큰, 이메일 인증 |
| **QnA** | questions, answers, *_comments, *_votes, question_tags, question_views | Q&A 게시판 |
| **HABIT** | habits, habit_records | 습관 추적 |
| **GROWTH_LOG** | growth_logs, growth_log_*, | 성장기록 블로그 |
| **GOAL** | yearly_goals | 연도별 목표 (JSON) |
| **COMMON** | tags | 공통 태그 시스템 |
| **NOTIFICATION** | notifications | 알림 |

## ERD 미리보기

```
User ──┬──< Question ──< Answer
       │        │           │
       │        └──< Comment, Vote, Tag, View
       │
       ├──< Habit ──< HabitRecord
       │
       ├──< GrowthLog ──< Comment, Vote, Tag, View
       │
       ├──< YearlyGoal
       │
       └──< Notification
```

## 공통 패턴

### Soft Delete
```sql
is_deleted BOOLEAN DEFAULT FALSE
deleted_at TIMESTAMP NULL
```

### Audit 컬럼
```sql
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
```

### 통계 캐싱
- `view_count`, `vote_count`, `answer_count`
- 조회 성능 최적화를 위해 비정규화

## 수정 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-02-02 | 초기 문서 작성 |
