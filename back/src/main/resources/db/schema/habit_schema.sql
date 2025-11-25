-- ============================================
-- Habit Tracking Schema
-- 습관 기록 기능 스키마
-- ============================================

-- Habits Table (습관 정의)
CREATE TABLE IF NOT EXISTS habits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '사용자 ID (FK to users.id)',

    -- 습관 정보
    title VARCHAR(100) NOT NULL COMMENT '습관명 (예: 운동하기, 물 8잔 마시기)',
    description TEXT COMMENT '습관 설명 (선택)',
    color VARCHAR(7) DEFAULT '#10B981' COMMENT '잔디/아이콘 색상 (HEX 코드)',

    -- 목표 설정
    target_count INT NOT NULL DEFAULT 1 COMMENT '하루 목표 횟수 (예: 물 8잔이면 8)',
    start_date DATE NOT NULL COMMENT '습관 시작일',
    end_date DATE NULL COMMENT '습관 종료일 (선택, NULL이면 무기한)',

    -- 통계 캐싱 (성능 최적화)
    current_streak INT NOT NULL DEFAULT 0 COMMENT '현재 연속 기록일',
    longest_streak INT NOT NULL DEFAULT 0 COMMENT '최장 연속 기록일',
    total_records INT NOT NULL DEFAULT 0 COMMENT '전체 기록 횟수',

    -- 상태 관리
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '습관 상태 (ACTIVE, ARCHIVED, DELETED)',

    -- 시간 관리
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL COMMENT 'DELETED 상태로 변경된 시각',

    -- 인덱스
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at DESC),

    -- FK 제약조건
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,

    -- 체크 제약조건
    CONSTRAINT chk_habit_status CHECK (status IN ('ACTIVE', 'ARCHIVED', 'DELETED')),
    CONSTRAINT chk_target_count CHECK (target_count >= 1),
    CONSTRAINT chk_current_streak CHECK (current_streak >= 0),
    CONSTRAINT chk_longest_streak CHECK (longest_streak >= 0),
    CONSTRAINT chk_end_date CHECK (end_date IS NULL OR end_date >= start_date)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='습관 정의 (목표)';


-- Habit Records Table (습관 실행 기록)
CREATE TABLE IF NOT EXISTS habit_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- FK
    habit_id BIGINT NOT NULL COMMENT '습관 ID (FK to habits.id)',
    user_id BIGINT NOT NULL COMMENT '사용자 ID (FK to users.id)',

    -- 기록 정보 (핵심!)
    record_date DATE NOT NULL COMMENT '날짜 기준값 (YYYY-MM-DD) - 잔디 UI에서 사용',
    logged_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '실제 기록한 시각 (타임스탬프)',

    -- 상세 정보
    count INT NOT NULL DEFAULT 1 COMMENT '이 기록의 횟수 (예: 운동 1회, 물 2잔)',
    note TEXT COMMENT '메모/코멘트 (선택)',

    -- Soft Delete
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    -- 시간 관리
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- 인덱스 (성능 최적화 핵심!)
    INDEX idx_habit_id (habit_id),
    INDEX idx_user_id (user_id),
    INDEX idx_record_date (record_date DESC),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_habit_date (habit_id, record_date, is_deleted) COMMENT '잔디 UI 조회용 복합 인덱스',

    -- FK 제약조건
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,

    -- 체크 제약조건
    CONSTRAINT chk_record_count CHECK (count >= 1)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='습관 실행 기록 (1회 기록 = 1개 레코드)';


-- ============================================
-- 유용한 쿼리 예시
-- ============================================

-- 1. 잔디 UI: 월별 날짜별 기록 횟수
-- SELECT record_date, COUNT(*) as count
-- FROM habit_records
-- WHERE habit_id = ?
--   AND record_date BETWEEN '2025-01-01' AND '2025-01-31'
--   AND is_deleted = false
-- GROUP BY record_date;

-- 2. Streak 계산: 기록된 날짜 목록 (중복 제거, 최신순)
-- SELECT DISTINCT record_date
-- FROM habit_records
-- WHERE habit_id = ? AND is_deleted = false
-- ORDER BY record_date DESC;

-- 3. 특정 날짜의 기록 목록
-- SELECT *
-- FROM habit_records
-- WHERE habit_id = ?
--   AND record_date = '2025-01-15'
--   AND is_deleted = false
-- ORDER BY logged_at DESC;

-- 4. 습관 목록 조회 (DELETED 제외)
-- SELECT *
-- FROM habits
-- WHERE user_id = ? AND status != 'DELETED'
-- ORDER BY created_at DESC;

-- 5. 특정 기간의 기록 횟수 합계
-- SELECT COALESCE(SUM(count), 0) as total_count
-- FROM habit_records
-- WHERE habit_id = ?
--   AND record_date BETWEEN '2025-01-01' AND '2025-01-31'
--   AND is_deleted = false;


-- ============================================
-- 더미 데이터 (테스트용)
-- ============================================

-- 주의: 실행 전에 user_id를 실제 존재하는 사용자 ID로 변경하세요!
SET @user_id = 1;

-- ============================================
-- 1. 습관 데이터 삽입
-- ============================================

-- 습관 1: 운동하기 (ACTIVE, 연속 기록 있음 - Streak 테스트용)
INSERT INTO habits (user_id, title, description, color, target_count, start_date, current_streak, longest_streak, total_records, status, created_at)
VALUES (
    @user_id,
    '운동하기',
    '매일 30분 이상 운동하기 (헬스, 러닝, 요가 등)',
    '#10B981',
    1,
    DATE_SUB(CURDATE(), INTERVAL 30 DAY),
    7,
    10,
    25,
    'ACTIVE',
    DATE_SUB(NOW(), INTERVAL 30 DAY)
);
SET @habit_exercise = LAST_INSERT_ID();

-- 습관 2: 물 8잔 마시기 (ACTIVE, 하루 여러 기록 테스트용)
INSERT INTO habits (user_id, title, description, color, target_count, start_date, current_streak, longest_streak, total_records, status, created_at)
VALUES (
    @user_id,
    '물 8잔 마시기',
    '하루 2L (8잔) 물 마시기',
    '#3B82F6',
    8,
    DATE_SUB(CURDATE(), INTERVAL 15 DAY),
    5,
    8,
    45,
    'ACTIVE',
    DATE_SUB(NOW(), INTERVAL 15 DAY)
);
SET @habit_water = LAST_INSERT_ID();

-- 습관 3: 독서 30분 (ACTIVE, 띄엄띄엄 기록)
INSERT INTO habits (user_id, title, description, color, target_count, start_date, current_streak, longest_streak, total_records, status, created_at)
VALUES (
    @user_id,
    '독서 30분',
    '매일 30분 이상 책 읽기',
    '#8B5CF6',
    1,
    DATE_SUB(CURDATE(), INTERVAL 60 DAY),
    0,
    5,
    20,
    'ACTIVE',
    DATE_SUB(NOW(), INTERVAL 60 DAY)
);
SET @habit_reading = LAST_INSERT_ID();

-- 습관 4: 명상하기 (ARCHIVED, 보관된 습관)
INSERT INTO habits (user_id, title, description, color, target_count, start_date, current_streak, longest_streak, total_records, status, created_at)
VALUES (
    @user_id,
    '명상하기',
    '아침 10분 명상',
    '#F59E0B',
    1,
    DATE_SUB(CURDATE(), INTERVAL 90 DAY),
    0,
    15,
    30,
    'ARCHIVED',
    DATE_SUB(NOW(), INTERVAL 90 DAY)
);
SET @habit_meditation = LAST_INSERT_ID();

-- 습관 5: 금연 (ACTIVE, 장기 기록)
INSERT INTO habits (user_id, title, description, color, target_count, start_date, current_streak, longest_streak, total_records, status, created_at)
VALUES (
    @user_id,
    '금연',
    '담배를 피우지 않은 날',
    '#EF4444',
    1,
    DATE_SUB(CURDATE(), INTERVAL 100 DAY),
    15,
    20,
    85,
    'ACTIVE',
    DATE_SUB(NOW(), INTERVAL 100 DAY)
);
SET @habit_quit_smoking = LAST_INSERT_ID();


-- ============================================
-- 2. 습관 기록 데이터 삽입
-- ============================================

-- ------------------------------------------------
-- 습관 1: 운동하기 - 최근 7일 연속 기록 (Streak 테스트)
-- ------------------------------------------------

-- 오늘
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES (@habit_exercise, @user_id, CURDATE(), NOW(), 1, '오늘도 완료!', FALSE);

-- 어제
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES (@habit_exercise, @user_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 1, '러닝 30분', FALSE);

-- 2일 전
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES (@habit_exercise, @user_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 1, '헬스 1시간', FALSE);

-- 3일 전
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES (@habit_exercise, @user_id, DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 1, '요가', FALSE);

-- 4일 전
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES (@habit_exercise, @user_id, DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), 1, '러닝', FALSE);

-- 5일 전
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES (@habit_exercise, @user_id, DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY), 1, '헬스', FALSE);

-- 6일 전
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES (@habit_exercise, @user_id, DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY), 1, '러닝', FALSE);

-- 8일 전 (7일 전 건너뜀 - Streak 끊김)
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES (@habit_exercise, @user_id, DATE_SUB(CURDATE(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY), 1, '헬스', FALSE);

-- 과거 기록 (월별 캘린더 테스트용)
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES
    (@habit_exercise, @user_id, DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY), 1, NULL, FALSE),
    (@habit_exercise, @user_id, DATE_SUB(CURDATE(), INTERVAL 12 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY), 1, NULL, FALSE),
    (@habit_exercise, @user_id, DATE_SUB(CURDATE(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY), 1, NULL, FALSE),
    (@habit_exercise, @user_id, DATE_SUB(CURDATE(), INTERVAL 18 DAY), DATE_SUB(NOW(), INTERVAL 18 DAY), 1, NULL, FALSE),
    (@habit_exercise, @user_id, DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 20 DAY), 1, NULL, FALSE),
    (@habit_exercise, @user_id, DATE_SUB(CURDATE(), INTERVAL 22 DAY), DATE_SUB(NOW(), INTERVAL 22 DAY), 1, NULL, FALSE),
    (@habit_exercise, @user_id, DATE_SUB(CURDATE(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 25 DAY), 1, NULL, FALSE);


-- ------------------------------------------------
-- 습관 2: 물 8잔 마시기 - 하루 여러 기록 (count 테스트)
-- ------------------------------------------------

-- 오늘 - 3번 기록 (총 6잔)
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES
    (@habit_water, @user_id, CURDATE(), TIMESTAMP(CURDATE(), '08:00:00'), 2, '아침 기상 후', FALSE),
    (@habit_water, @user_id, CURDATE(), TIMESTAMP(CURDATE(), '12:30:00'), 3, '점심 식사 후', FALSE),
    (@habit_water, @user_id, CURDATE(), TIMESTAMP(CURDATE(), '18:00:00'), 1, '저녁 식사 전', FALSE);

-- 어제 - 2번 기록 (총 8잔 달성!)
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES
    (@habit_water, @user_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(TIMESTAMP(CURDATE(), '09:00:00'), INTERVAL 1 DAY), 4, '오전', FALSE),
    (@habit_water, @user_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(TIMESTAMP(CURDATE(), '16:00:00'), INTERVAL 1 DAY), 4, '오후', FALSE);

-- 2일 전 - 1번 기록만 (3잔)
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES (@habit_water, @user_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 3, NULL, FALSE);

-- 3일 전 - 목표 달성
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES
    (@habit_water, @user_id, DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_SUB(TIMESTAMP(CURDATE(), '10:00:00'), INTERVAL 3 DAY), 5, NULL, FALSE),
    (@habit_water, @user_id, DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_SUB(TIMESTAMP(CURDATE(), '17:00:00'), INTERVAL 3 DAY), 3, NULL, FALSE);

-- 4일 전 - 목표 달성
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES (@habit_water, @user_id, DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), 8, '하루 한번에 기록', FALSE);

-- 과거 기록 (월별 분포)
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES
    (@habit_water, @user_id, DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY), 5, NULL, FALSE),
    (@habit_water, @user_id, DATE_SUB(CURDATE(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY), 6, NULL, FALSE),
    (@habit_water, @user_id, DATE_SUB(CURDATE(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY), 4, NULL, FALSE),
    (@habit_water, @user_id, DATE_SUB(CURDATE(), INTERVAL 11 DAY), DATE_SUB(NOW(), INTERVAL 11 DAY), 7, NULL, FALSE),
    (@habit_water, @user_id, DATE_SUB(CURDATE(), INTERVAL 13 DAY), DATE_SUB(NOW(), INTERVAL 13 DAY), 8, NULL, FALSE);


-- ------------------------------------------------
-- 습관 3: 독서 30분 - 띄엄띄엄 기록 (Streak 0)
-- ------------------------------------------------

-- 3일 전
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES (@habit_reading, @user_id, DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 1, '소설 50페이지', FALSE);

-- 7일 전
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES (@habit_reading, @user_id, DATE_SUB(CURDATE(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY), 1, '자기계발서', FALSE);

-- 10일 전
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES (@habit_reading, @user_id, DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY), 1, NULL, FALSE);

-- 15일 전
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES (@habit_reading, @user_id, DATE_SUB(CURDATE(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY), 1, NULL, FALSE);

-- 과거 기록
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES
    (@habit_reading, @user_id, DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 20 DAY), 1, NULL, FALSE),
    (@habit_reading, @user_id, DATE_SUB(CURDATE(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 25 DAY), 1, NULL, FALSE),
    (@habit_reading, @user_id, DATE_SUB(CURDATE(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 30 DAY), 1, NULL, FALSE),
    (@habit_reading, @user_id, DATE_SUB(CURDATE(), INTERVAL 35 DAY), DATE_SUB(NOW(), INTERVAL 35 DAY), 1, NULL, FALSE);


-- ------------------------------------------------
-- 습관 4: 명상하기 (ARCHIVED) - 과거 기록만
-- ------------------------------------------------

-- 보관되기 전 기록들
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES
    (@habit_meditation, @user_id, DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 20 DAY), 1, '아침 명상', FALSE),
    (@habit_meditation, @user_id, DATE_SUB(CURDATE(), INTERVAL 22 DAY), DATE_SUB(NOW(), INTERVAL 22 DAY), 1, NULL, FALSE),
    (@habit_meditation, @user_id, DATE_SUB(CURDATE(), INTERVAL 23 DAY), DATE_SUB(NOW(), INTERVAL 23 DAY), 1, NULL, FALSE),
    (@habit_meditation, @user_id, DATE_SUB(CURDATE(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 25 DAY), 1, NULL, FALSE),
    (@habit_meditation, @user_id, DATE_SUB(CURDATE(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 30 DAY), 1, NULL, FALSE);


-- ------------------------------------------------
-- 습관 5: 금연 - 장기 연속 기록
-- ------------------------------------------------

-- 최근 15일 연속
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES
    (@habit_quit_smoking, @user_id, CURDATE(), NOW(), 1, '금연 성공!', FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 1, NULL, FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 1, NULL, FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 1, NULL, FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), 1, NULL, FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY), 1, NULL, FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY), 1, NULL, FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY), 1, NULL, FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY), 1, NULL, FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY), 1, NULL, FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY), 1, NULL, FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 11 DAY), DATE_SUB(NOW(), INTERVAL 11 DAY), 1, NULL, FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 12 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY), 1, NULL, FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 13 DAY), DATE_SUB(NOW(), INTERVAL 13 DAY), 1, NULL, FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 14 DAY), DATE_SUB(NOW(), INTERVAL 14 DAY), 1, NULL, FALSE);

-- 과거 띄엄띄엄 기록 (최장 연속일 20일 달성했던 기록)
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 20 DAY), 1, NULL, FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 25 DAY), 1, NULL, FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 30 DAY), 1, NULL, FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 35 DAY), DATE_SUB(NOW(), INTERVAL 35 DAY), 1, NULL, FALSE),
    (@habit_quit_smoking, @user_id, DATE_SUB(CURDATE(), INTERVAL 40 DAY), DATE_SUB(NOW(), INTERVAL 40 DAY), 1, NULL, FALSE);


-- ============================================
-- 3. Soft Delete 테스트용 삭제된 기록
-- ============================================

-- 실수로 기록했다가 삭제한 케이스
INSERT INTO habit_records (habit_id, user_id, record_date, logged_at, count, note, is_deleted)
VALUES (@habit_exercise, @user_id, DATE_SUB(CURDATE(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY), 1, '실수로 기록', TRUE);


-- ============================================
-- 더미 데이터 삽입 완료!
-- ============================================

-- 검증 쿼리 (선택적 실행)
-- SELECT 'Habits' as category, COUNT(*) as count FROM habits WHERE user_id = @user_id
-- UNION ALL
-- SELECT 'Active Habits', COUNT(*) FROM habits WHERE user_id = @user_id AND status = 'ACTIVE'
-- UNION ALL
-- SELECT 'Habit Records', COUNT(*) FROM habit_records WHERE user_id = @user_id AND is_deleted = FALSE
-- UNION ALL
-- SELECT 'Deleted Records', COUNT(*) FROM habit_records WHERE user_id = @user_id AND is_deleted = TRUE;
