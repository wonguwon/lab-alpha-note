package com.alpha_note.core.habit.service;

import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.habit.dto.request.CreateHabitRecordRequest;
import com.alpha_note.core.habit.dto.request.UpdateHabitRecordRequest;
import com.alpha_note.core.habit.dto.response.HabitRecordResponse;
import com.alpha_note.core.habit.entity.Habit;
import com.alpha_note.core.habit.entity.HabitRecord;
import com.alpha_note.core.habit.repository.HabitRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HabitRecordService {

    private final HabitRecordRepository habitRecordRepository;
    private final HabitService habitService;
    private final HabitStreakService habitStreakService;

    /**
     * 습관 기록 생성
     */
    @Transactional
    public HabitRecordResponse createRecord(Long habitId, Long userId, CreateHabitRecordRequest request) {
        // 습관 조회 및 권한 확인
        Habit habit = habitService.getHabitEntity(habitId, userId);

        // 유효성 검증
        validateRecordDate(habit, request.getRecordDate());

        // 기록 생성
        HabitRecord record = HabitRecord.builder()
                .habitId(habitId)
                .userId(userId)
                .recordDate(request.getRecordDate())
                .loggedAt(Instant.now())
                .count(request.getCount())
                .note(request.getNote())
                .build();

        HabitRecord savedRecord = habitRecordRepository.save(record);

        // 습관 통계 업데이트
        habit.incrementTotalRecords();

        // Streak 계산 및 업데이트
        habitStreakService.calculateAndUpdateStreak(habit);

        return HabitRecordResponse.from(savedRecord);
    }

    /**
     * 습관 기록 목록 조회 (페이징, 비로그인 허용)
     */
    public Page<HabitRecordResponse> getRecords(Long habitId, Pageable pageable) {
        Page<HabitRecord> records = habitRecordRepository
                .findByHabitIdAndIsDeletedFalseOrderByRecordDateDesc(habitId, pageable);

        return records.map(HabitRecordResponse::from);
    }

    /**
     * 특정 날짜의 습관 기록 조회 (비로그인 허용)
     */
    public List<HabitRecordResponse> getRecordsByDate(Long habitId, LocalDate date) {
        List<HabitRecord> records = habitRecordRepository
                .findByHabitIdAndRecordDateAndIsDeletedFalse(habitId, date);

        return records.stream()
                .map(HabitRecordResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 습관 기록 상세 조회 (비로그인 허용)
     */
    public HabitRecordResponse getRecord(Long recordId) {
        HabitRecord record = habitRecordRepository.findByIdAndIsDeletedFalse(recordId)
                .orElseThrow(() -> new CustomException(ErrorCode.HABIT_RECORD_NOT_FOUND));

        return HabitRecordResponse.from(record);
    }

    /**
     * 습관 기록 수정
     */
    @Transactional
    public HabitRecordResponse updateRecord(Long recordId, Long userId, UpdateHabitRecordRequest request) {
        HabitRecord record = habitRecordRepository.findByIdAndIsDeletedFalse(recordId)
                .orElseThrow(() -> new CustomException(ErrorCode.HABIT_RECORD_NOT_FOUND));

        // 권한 확인
        if (!record.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.HABIT_RECORD_ACCESS_DENIED);
        }

        // 기록 수정
        record.update(request.getCount(), request.getNote());

        return HabitRecordResponse.from(record);
    }

    /**
     * 습관 기록 삭제 (Soft Delete)
     */
    @Transactional
    public void deleteRecord(Long recordId, Long userId) {
        HabitRecord record = habitRecordRepository.findByIdAndIsDeletedFalse(recordId)
                .orElseThrow(() -> new CustomException(ErrorCode.HABIT_RECORD_NOT_FOUND));

        // 권한 확인
        if (!record.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.HABIT_RECORD_ACCESS_DENIED);
        }

        // Soft Delete
        record.markAsDeleted();

        // 습관 통계 업데이트
        Habit habit = habitService.getHabitEntity(record.getHabitId(), userId);
        habit.decrementTotalRecords();

        // Streak 재계산
        habitStreakService.calculateAndUpdateStreak(habit);
    }

    /**
     * 기록 날짜 유효성 검증
     */
    private void validateRecordDate(Habit habit, LocalDate recordDate) {
        LocalDate today = LocalDate.now();

        // 미래 날짜 체크
        if (recordDate.isAfter(today)) {
            throw new CustomException(ErrorCode.FUTURE_RECORD_NOT_ALLOWED);
        }

        // 습관 시작일 이전 체크
        if (recordDate.isBefore(habit.getStartDate())) {
            throw new CustomException(ErrorCode.RECORD_DATE_BEFORE_START_DATE);
        }

        // 습관 종료일 이후 체크
        if (habit.getEndDate() != null && recordDate.isAfter(habit.getEndDate())) {
            throw new CustomException(ErrorCode.HABIT_END_DATE_PASSED);
        }
    }
}
