-- ============================================================
-- Alpha-Note Database Schema
-- MySQL 8.0+
-- 최종 업데이트: 2026-02-02
-- ============================================================

-- 데이터베이스 생성 (필요시)
-- CREATE DATABASE IF NOT EXISTS alpha_note DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE alpha_note;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. USER 도메인
-- ============================================================

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nickname VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    role VARCHAR(255) DEFAULT 'USER',
    provider VARCHAR(255) DEFAULT 'LOCAL',
    provider_id VARCHAR(255),
    profile_image_url VARCHAR(255),
    email_subscribed BOOLEAN DEFAULT FALSE,
    account_locked BOOLEAN DEFAULT FALSE,
    password_expired_at TIMESTAMP NULL,
    last_password_reset_at TIMESTAMP NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    deletion_scheduled_at TIMESTAMP NULL,
    deletion_reason VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. AUTH 도메인
-- ============================================================

DROP TABLE IF EXISTS refresh_tokens;
CREATE TABLE refresh_tokens (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NULL,
    last_used_at TIMESTAMP NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_token (token),
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at),
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS email_verifications;
CREATE TABLE email_verifications (
    id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(6) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    attempt_count INT DEFAULT 0,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_email_verified (email, verified),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. COMMON 도메인 (태그 - 다른 도메인에서 참조)
-- ============================================================

DROP TABLE IF EXISTS tags;
CREATE TABLE tags (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    use_count INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_name (name),
    INDEX idx_name (name),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_use_count (use_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. QnA 도메인
-- ============================================================

DROP TABLE IF EXISTS questions;
CREATE TABLE questions (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(255) DEFAULT 'TECH',
    view_count INT DEFAULT 0,
    vote_count INT DEFAULT 0,
    answer_count INT DEFAULT 0,
    is_answered BOOLEAN DEFAULT FALSE,
    accepted_answer_id BIGINT,
    last_activity_at TIMESTAMP NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_user_id (user_id),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_created_at (created_at),
    INDEX idx_vote_count (vote_count),
    INDEX idx_last_activity_at (last_activity_at),
    INDEX idx_is_answered (is_answered),
    INDEX idx_accepted_answer_id (accepted_answer_id),
    INDEX idx_category (category),
    CONSTRAINT fk_questions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS answers;
CREATE TABLE answers (
    id BIGINT NOT NULL AUTO_INCREMENT,
    question_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    vote_count INT DEFAULT 0,
    is_accepted BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_question_id (question_id),
    INDEX idx_user_id (user_id),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_is_accepted (is_accepted),
    INDEX idx_vote_count (vote_count),
    INDEX idx_created_at (created_at),
    CONSTRAINT fk_answers_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    CONSTRAINT fk_answers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS question_comments;
CREATE TABLE question_comments (
    id BIGINT NOT NULL AUTO_INCREMENT,
    question_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_question_id (question_id),
    INDEX idx_user_id (user_id),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_created_at (created_at),
    CONSTRAINT fk_question_comments_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    CONSTRAINT fk_question_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS answer_comments;
CREATE TABLE answer_comments (
    id BIGINT NOT NULL AUTO_INCREMENT,
    answer_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_answer_id (answer_id),
    INDEX idx_user_id (user_id),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_created_at (created_at),
    CONSTRAINT fk_answer_comments_answer FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE,
    CONSTRAINT fk_answer_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS question_votes;
CREATE TABLE question_votes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    question_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_question_user_vote (question_id, user_id),
    INDEX idx_user_id (user_id),
    CONSTRAINT fk_question_votes_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    CONSTRAINT fk_question_votes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS answer_votes;
CREATE TABLE answer_votes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    answer_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_answer_user_vote (answer_id, user_id),
    INDEX idx_user_id (user_id),
    CONSTRAINT fk_answer_votes_answer FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE,
    CONSTRAINT fk_answer_votes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS question_tags;
CREATE TABLE question_tags (
    id BIGINT NOT NULL AUTO_INCREMENT,
    question_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_question_tag (question_id, tag_id),
    INDEX idx_tag_id (tag_id),
    CONSTRAINT fk_question_tags_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    CONSTRAINT fk_question_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS question_views;
CREATE TABLE question_views (
    question_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (question_id, user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_viewed_at (viewed_at),
    CONSTRAINT fk_question_views_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    CONSTRAINT fk_question_views_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. HABIT 도메인
-- ============================================================

DROP TABLE IF EXISTS habits;
CREATE TABLE habits (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#10B981',
    target_count INT DEFAULT 1,
    start_date DATE NOT NULL,
    end_date DATE,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    total_records INT DEFAULT 0,
    status VARCHAR(255) DEFAULT 'ACTIVE',
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    CONSTRAINT fk_habits_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS habit_records;
CREATE TABLE habit_records (
    id BIGINT NOT NULL AUTO_INCREMENT,
    habit_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    record_date DATE NOT NULL,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    count INT DEFAULT 1,
    note TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_habit_id (habit_id),
    INDEX idx_user_id (user_id),
    INDEX idx_record_date (record_date),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_habit_date (habit_id, record_date),
    CONSTRAINT fk_habit_records_habit FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    CONSTRAINT fk_habit_records_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. GROWTH_LOG 도메인
-- ============================================================

DROP TABLE IF EXISTS growth_logs;
CREATE TABLE growth_logs (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    thumbnail_url VARCHAR(1000),
    status VARCHAR(255) DEFAULT 'PUBLISHED',
    visibility VARCHAR(255) DEFAULT 'PUBLIC',
    view_count INT DEFAULT 0,
    vote_count INT DEFAULT 0,
    last_activity_at TIMESTAMP NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_user_id (user_id),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_created_at (created_at),
    INDEX idx_vote_count (vote_count),
    INDEX idx_status_visibility (status, visibility),
    CONSTRAINT fk_growth_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS growth_log_comments;
CREATE TABLE growth_log_comments (
    id BIGINT NOT NULL AUTO_INCREMENT,
    growth_log_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_growth_log_id (growth_log_id),
    INDEX idx_user_id (user_id),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_created_at (created_at),
    CONSTRAINT fk_growth_log_comments_growth_log FOREIGN KEY (growth_log_id) REFERENCES growth_logs(id) ON DELETE CASCADE,
    CONSTRAINT fk_growth_log_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS growth_log_votes;
CREATE TABLE growth_log_votes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    growth_log_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_growth_log_user_vote (growth_log_id, user_id),
    INDEX idx_user_id (user_id),
    CONSTRAINT fk_growth_log_votes_growth_log FOREIGN KEY (growth_log_id) REFERENCES growth_logs(id) ON DELETE CASCADE,
    CONSTRAINT fk_growth_log_votes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS growth_log_tags;
CREATE TABLE growth_log_tags (
    id BIGINT NOT NULL AUTO_INCREMENT,
    growth_log_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_growth_log_tag (growth_log_id, tag_id),
    INDEX idx_tag_id (tag_id),
    CONSTRAINT fk_growth_log_tags_growth_log FOREIGN KEY (growth_log_id) REFERENCES growth_logs(id) ON DELETE CASCADE,
    CONSTRAINT fk_growth_log_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS growth_log_views;
CREATE TABLE growth_log_views (
    growth_log_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (growth_log_id, user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_viewed_at (viewed_at),
    CONSTRAINT fk_growth_log_views_growth_log FOREIGN KEY (growth_log_id) REFERENCES growth_logs(id) ON DELETE CASCADE,
    CONSTRAINT fk_growth_log_views_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. GOAL 도메인
-- ============================================================

DROP TABLE IF EXISTS yearly_goals;
CREATE TABLE yearly_goals (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    year INT NOT NULL,
    goals JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_year (user_id, year),
    INDEX idx_user_id (user_id),
    INDEX idx_year (year),
    INDEX idx_user_year (user_id, year),
    CONSTRAINT fk_yearly_goals_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. NOTIFICATION 도메인
-- ============================================================

DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type VARCHAR(50),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    related_entity_type VARCHAR(50),
    related_entity_id BIGINT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_user_id_is_read (user_id, is_read),
    INDEX idx_created_at (created_at),
    INDEX idx_user_id (user_id),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 스키마 생성 완료
-- ============================================================
