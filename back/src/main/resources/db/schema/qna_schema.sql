-- ============================================
-- QnA Feature Database Schema
-- ============================================
-- Author: Claude Code
-- Date: 2025-11-07
-- Description: 회원들이 QnA를 작성하고 서로 답변을 달 수 있는 기능
-- ============================================

-- ============================================
-- 1. Tags Table (태그 마스터)
-- ============================================
CREATE TABLE tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '태그명 (예: java, spring, mysql)',
    description TEXT COMMENT '태그 설명',
    use_count INT NOT NULL DEFAULT 0 COMMENT '사용 횟수 (캐싱)',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시 (UTC)',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시 (UTC)',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '소프트 삭제 여부',
    deleted_at TIMESTAMP NULL COMMENT '삭제일시',

    INDEX idx_name (name),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_use_count (use_count DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='태그 마스터 테이블';

-- ============================================
-- 2. Questions Table (질문)
-- ============================================
CREATE TABLE questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '작성자 ID (FK to users.id)',
    title VARCHAR(255) NOT NULL COMMENT '질문 제목',
    content TEXT NOT NULL COMMENT '질문 내용 (마크다운)',
    view_count INT NOT NULL DEFAULT 0 COMMENT '조회수 (캐싱)',
    vote_count INT NOT NULL DEFAULT 0 COMMENT '추천수 (캐싱)',
    answer_count INT NOT NULL DEFAULT 0 COMMENT '답변 수 (캐싱)',
    is_answered BOOLEAN NOT NULL DEFAULT FALSE COMMENT '답변 채택 여부',
    accepted_answer_id BIGINT NULL COMMENT '채택된 답변 ID (FK to answers.id)',
    last_activity_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '마지막 활동일시 (정렬용)',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시 (UTC)',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시 (UTC)',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '소프트 삭제 여부',
    deleted_at TIMESTAMP NULL COMMENT '삭제일시',

    INDEX idx_user_id (user_id),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_vote_count (vote_count DESC),
    INDEX idx_last_activity_at (last_activity_at DESC),
    INDEX idx_is_answered (is_answered),
    INDEX idx_accepted_answer_id (accepted_answer_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (accepted_answer_id) REFERENCES answers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='질문 테이블';

-- ============================================
-- 3. Answers Table (답변)
-- ============================================
CREATE TABLE answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL COMMENT '질문 ID (FK to questions.id)',
    user_id BIGINT NOT NULL COMMENT '작성자 ID (FK to users.id)',
    content TEXT NOT NULL COMMENT '답변 내용 (마크다운)',
    vote_count INT NOT NULL DEFAULT 0 COMMENT '추천수 (캐싱)',
    is_accepted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '채택 여부',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시 (UTC)',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시 (UTC)',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '소프트 삭제 여부',
    deleted_at TIMESTAMP NULL COMMENT '삭제일시',

    INDEX idx_question_id (question_id),
    INDEX idx_user_id (user_id),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_is_accepted (is_accepted),
    INDEX idx_vote_count (vote_count DESC),
    INDEX idx_created_at (created_at DESC),

    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='답변 테이블';

-- ============================================
-- 4. Question_Tags Table (질문-태그 중간 테이블)
-- ============================================
CREATE TABLE question_tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL COMMENT '질문 ID (FK to questions.id)',
    tag_id BIGINT NOT NULL COMMENT '태그 ID (FK to tags.id)',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시 (UTC)',

    UNIQUE KEY uk_question_tag (question_id, tag_id),
    INDEX idx_tag_id (tag_id),

    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='질문-태그 중간 테이블';

-- ============================================
-- 5. Question_Comments Table (질문 댓글)
-- ============================================
CREATE TABLE question_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL COMMENT '질문 ID (FK to questions.id)',
    user_id BIGINT NOT NULL COMMENT '작성자 ID (FK to users.id)',
    content TEXT NOT NULL COMMENT '댓글 내용',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시 (UTC)',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시 (UTC)',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '소프트 삭제 여부',
    deleted_at TIMESTAMP NULL COMMENT '삭제일시',

    INDEX idx_question_id (question_id),
    INDEX idx_user_id (user_id),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_created_at (created_at DESC),

    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='질문 댓글 테이블';

-- ============================================
-- 6. Answer_Comments Table (답변 댓글)
-- ============================================
CREATE TABLE answer_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    answer_id BIGINT NOT NULL COMMENT '답변 ID (FK to answers.id)',
    user_id BIGINT NOT NULL COMMENT '작성자 ID (FK to users.id)',
    content TEXT NOT NULL COMMENT '댓글 내용',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시 (UTC)',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시 (UTC)',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '소프트 삭제 여부',
    deleted_at TIMESTAMP NULL COMMENT '삭제일시',

    INDEX idx_answer_id (answer_id),
    INDEX idx_user_id (user_id),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_created_at (created_at DESC),

    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='답변 댓글 테이블';

-- ============================================
-- 7. Question_Votes Table (질문 추천)
-- ============================================
CREATE TABLE question_votes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL COMMENT '질문 ID (FK to questions.id)',
    user_id BIGINT NOT NULL COMMENT '사용자 ID (FK to users.id)',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '추천일시 (UTC)',

    UNIQUE KEY uk_question_user_vote (question_id, user_id) COMMENT '사용자당 1표 제한',
    INDEX idx_user_id (user_id),

    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='질문 추천 테이블 (UP only)';

-- ============================================
-- 8. Answer_Votes Table (답변 추천)
-- ============================================
CREATE TABLE answer_votes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    answer_id BIGINT NOT NULL COMMENT '답변 ID (FK to answers.id)',
    user_id BIGINT NOT NULL COMMENT '사용자 ID (FK to users.id)',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '추천일시 (UTC)',

    UNIQUE KEY uk_answer_user_vote (answer_id, user_id) COMMENT '사용자당 1표 제한',
    INDEX idx_user_id (user_id),

    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='답변 추천 테이블 (UP only)';

-- ============================================
-- 9. Question_Attachments Table (질문 첨부 이미지)
-- ============================================
CREATE TABLE question_attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL COMMENT '질문 ID (FK to questions.id)',
    file_name VARCHAR(255) NOT NULL COMMENT '원본 파일명',
    file_size BIGINT NOT NULL COMMENT '파일 크기 (bytes)',
    content_type VARCHAR(50) NOT NULL COMMENT 'MIME 타입 (image/png, image/jpeg, image/webp)',
    s3_key VARCHAR(500) NOT NULL COMMENT 'S3 객체 키',
    cdn_url VARCHAR(500) NOT NULL COMMENT 'CloudFront CDN URL',
    uploaded_by BIGINT NOT NULL COMMENT '업로드한 사용자 ID (FK to users.id)',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '업로드일시 (UTC)',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '소프트 삭제 여부',
    deleted_at TIMESTAMP NULL COMMENT '삭제일시',

    INDEX idx_question_id (question_id),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_s3_key (s3_key),

    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT,

    CONSTRAINT chk_content_type CHECK (content_type IN ('image/png', 'image/jpeg', 'image/webp'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='질문 첨부 이미지 테이블';

-- ============================================
-- 10. Answer_Attachments Table (답변 첨부 이미지)
-- ============================================
CREATE TABLE answer_attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    answer_id BIGINT NOT NULL COMMENT '답변 ID (FK to answers.id)',
    file_name VARCHAR(255) NOT NULL COMMENT '원본 파일명',
    file_size BIGINT NOT NULL COMMENT '파일 크기 (bytes)',
    content_type VARCHAR(50) NOT NULL COMMENT 'MIME 타입 (image/png, image/jpeg, image/webp)',
    s3_key VARCHAR(500) NOT NULL COMMENT 'S3 객체 키',
    cdn_url VARCHAR(500) NOT NULL COMMENT 'CloudFront CDN URL',
    uploaded_by BIGINT NOT NULL COMMENT '업로드한 사용자 ID (FK to users.id)',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '업로드일시 (UTC)',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '소프트 삭제 여부',
    deleted_at TIMESTAMP NULL COMMENT '삭제일시',

    INDEX idx_answer_id (answer_id),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_s3_key (s3_key),

    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT,

    CONSTRAINT chk_content_type CHECK (content_type IN ('image/png', 'image/jpeg', 'image/webp'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='답변 첨부 이미지 테이블';

-- ============================================
-- 스키마 적용 순서 (Foreign Key 고려)
-- ============================================
-- 1. tags (독립)
-- 2. questions (users 참조, answers는 나중에 추가)
-- 3. answers (questions, users 참조)
-- 4. questions의 accepted_answer_id FK 추가 (ALTER TABLE)
-- 5. question_tags (questions, tags 참조)
-- 6. question_comments (questions, users 참조)
-- 7. answer_comments (answers, users 참조)
-- 8. question_votes (questions, users 참조)
-- 9. answer_votes (answers, users 참조)
-- 10. question_attachments (questions, users 참조)
-- 11. answer_attachments (answers, users 참조)

-- ============================================
-- 주의사항
-- ============================================
-- 1. questions.accepted_answer_id는 순환 참조이므로:
--    - 초기 생성 시 제외하고 테이블 생성
--    - answers 테이블 생성 후 ALTER TABLE로 FK 추가
--    또는
--    - FK 제약조건 없이 application level에서 관리
--
-- 2. Soft Delete 처리:
--    - Question 삭제 시 Answers/Comments도 cascade soft delete 필요
--    - Application level에서 처리
--
-- 3. vote_count, answer_count 등 캐싱 필드:
--    - 트리거 또는 application level에서 동기화
--    - 성능을 위해 실시간 집계 대신 캐싱 사용
--
-- 4. 인덱스 전략:
--    - 모든 FK는 인덱스 필수
--    - 필터링/정렬 컬럼 (is_deleted, created_at, vote_count 등)
--    - 복합 UNIQUE 인덱스 (vote 중복 방지)

-- ============================================
-- 초기 데이터 (선택적)
-- ============================================
-- 기본 태그 삽입 예시
INSERT INTO tags (name, description) VALUES
('java', 'Java 프로그래밍 언어 관련 질문'),
('spring', 'Spring Framework 관련 질문'),
('mysql', 'MySQL 데이터베이스 관련 질문'),
('jpa', 'JPA/Hibernate ORM 관련 질문'),
('react', 'React.js 프론트엔드 관련 질문');
