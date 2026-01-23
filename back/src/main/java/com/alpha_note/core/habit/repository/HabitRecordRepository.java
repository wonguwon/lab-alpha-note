package com.alpha_note.core.habit.repository;

import com.alpha_note.core.habit.entity.HabitRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HabitRecordRepository extends JpaRepository<HabitRecord, Long> {

    /**
     * 기록 ID로 조회 (Soft Delete 고려)
     */
    Optional<HabitRecord> findByIdAndIsDeletedFalse(Long id);

    /**
     * 습관 ID로 기록 조회 (페이징, 최신순)
     */
    Page<HabitRecord> findByHabitIdAndIsDeletedFalseOrderByRecordDateDesc(Long habitId, Pageable pageable);

    /**
     * 습관 ID와 날짜로 기록 조회
     */
    List<HabitRecord> findByHabitIdAndRecordDateAndIsDeletedFalse(Long habitId, LocalDate recordDate);

    /**
     * 기록된 날짜 목록 조회 (중복 제거, 최신순)
     * Streak 계산용
     */
    @Query("SELECT DISTINCT hr.recordDate FROM HabitRecord hr " +
           "WHERE hr.habitId = :habitId AND hr.isDeleted = false " +
           "ORDER BY hr.recordDate DESC")
    List<LocalDate> findDistinctRecordDatesByHabitIdOrderByRecordDateDesc(@Param("habitId") Long habitId);

    /**
     * 기간별 기록 조회
     * 잔디 UI용
     */
    List<HabitRecord> findByHabitIdAndRecordDateBetweenAndIsDeletedFalse(
        Long habitId, LocalDate startDate, LocalDate endDate
    );

    /**
     * 특정 날짜의 기록 횟수 합계
     */
    @Query("SELECT COALESCE(SUM(hr.count), 0) FROM HabitRecord hr " +
           "WHERE hr.habitId = :habitId AND hr.recordDate = :recordDate " +
           "AND hr.isDeleted = false")
    Integer sumCountByHabitIdAndRecordDate(
        @Param("habitId") Long habitId,
        @Param("recordDate") LocalDate recordDate
    );

    /**
     * 습관별 전체 기록 횟수
     */
    long countByHabitIdAndIsDeletedFalse(Long habitId);

    /**
     * 사용자별 기록 조회 (페이징)
     */
    Page<HabitRecord> findByUserIdAndIsDeletedFalseOrderByRecordDateDesc(Long userId, Pageable pageable);

    /**
     * 습관별 기록된 날짜 개수 (중복 제거)
     */
    @Query("SELECT COUNT(DISTINCT hr.recordDate) FROM HabitRecord hr " +
           "WHERE hr.habitId = :habitId AND hr.isDeleted = false")
    long countDistinctRecordDatesByHabitId(@Param("habitId") Long habitId);

    /**
     * 특정 날짜 범위의 기록 횟수 합계
     */
    @Query("SELECT COALESCE(SUM(hr.count), 0) FROM HabitRecord hr " +
           "WHERE hr.habitId = :habitId " +
           "AND hr.recordDate BETWEEN :startDate AND :endDate " +
           "AND hr.isDeleted = false")
    Integer sumCountByHabitIdAndDateRange(
        @Param("habitId") Long habitId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    /**
     * 여러 습관의 날짜 범위 기록 일괄 조회
     * 대시보드 페이지에서 N+1 문제 방지용
     */
    List<HabitRecord> findByHabitIdInAndRecordDateBetweenAndIsDeletedFalse(
        List<Long> habitIds,
        LocalDate startDate,
        LocalDate endDate
    );
}
