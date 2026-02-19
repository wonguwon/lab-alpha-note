# DDL 스크립트 사용 가이드

## 파일 목록

| 파일 | 설명 |
|------|------|
| `schema.sql` | 전체 스키마 생성 스크립트 (21개 테이블) |

## 실행 방법

### 1. 전체 스키마 생성

```bash
mysql -u [username] -p [database_name] < schema.sql
```

### 2. MySQL Workbench에서 실행

1. MySQL Workbench 실행
2. 대상 데이터베이스 연결
3. File > Open SQL Script > `schema.sql` 선택
4. 실행 (Ctrl + Shift + Enter)

## 주의사항

- `schema.sql`은 기존 테이블을 **DROP 후 재생성**합니다
- 운영 환경에서는 백업 후 실행하세요
- 외래키 제약조건으로 인해 순서대로 실행됩니다

## 테이블 의존성 순서

```
1. users (기본)
2. tags (기본)
3. refresh_tokens (users 의존)
4. email_verifications (독립)
5. questions (users 의존)
6. answers (questions, users 의존)
7. question_comments (questions, users 의존)
8. answer_comments (answers, users 의존)
9. question_votes (questions, users 의존)
10. answer_votes (answers, users 의존)
11. question_tags (questions, tags 의존)
12. question_views (questions, users 의존)
13. habits (users 의존)
14. habit_records (habits, users 의존)
15. growth_logs (users 의존)
16. growth_log_comments (growth_logs, users 의존)
17. growth_log_votes (growth_logs, users 의존)
18. growth_log_tags (growth_logs, tags 의존)
19. growth_log_views (growth_logs, users 의존)
20. yearly_goals (users 의존)
21. notifications (users 의존)
```

## Hibernate 자동 생성과의 차이

현재 프로젝트는 JPA/Hibernate를 사용하므로 `spring.jpa.hibernate.ddl-auto` 설정에 따라 스키마가 자동 관리됩니다.

이 DDL 스크립트는 다음 용도로 사용합니다:
- 운영 환경 초기 배포
- 데이터베이스 구조 문서화
- 수동 마이그레이션이 필요한 경우
