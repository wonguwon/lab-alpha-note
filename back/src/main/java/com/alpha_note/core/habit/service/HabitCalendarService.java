package com.alpha_note.core.habit.service;

import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.habit.dto.response.HabitCalendarResponse;
import com.alpha_note.core.habit.entity.Habit;
import com.alpha_note.core.habit.entity.HabitRecord;
import com.alpha_note.core.habit.enums.HabitStatus;
import com.alpha_note.core.habit.repository.HabitRecordRepository;
import com.alpha_note.core.habit.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HabitCalendarService {

    private final HabitRecordRepository habitRecordRepository;
    private final HabitRepository habitRepository;

    /**
     * 월별 잔디 데이터 조회 (비로그인 허용)
     *
     * @param habitId 습관 ID
     * @param yearMonth 조회할 년월 (예: 2025-01)
     * @return 날짜별 기록 횟수 맵
     */
    public HabitCalendarResponse getMonthlyCalendar(Long habitId, YearMonth yearMonth) {
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        // 날짜별 기록 횟수 집계
        List<HabitRecord> records = habitRecordRepository
                .findByHabitIdAndRecordDateBetweenAndIsDeletedFalse(habitId, startDate, endDate);

        Map<LocalDate, Long> recordCountByDate = records.stream()
                .collect(Collectors.groupingBy(
                        HabitRecord::getRecordDate,
                        Collectors.counting()
                ));

        return HabitCalendarResponse.builder()
                .yearMonth(yearMonth)
                .recordCountByDate(recordCountByDate)
                .build();
    }

    /**
     * 특정 기간의 잔디 데이터 조회 (비로그인 허용)
     */
    public HabitCalendarResponse getCalendarByDateRange(
            Long habitId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        // 습관 조회
        Habit habit = habitRepository.findByIdAndStatusNot(habitId, HabitStatus.DELETED)
                .orElseThrow(() -> new CustomException(ErrorCode.HABIT_NOT_FOUND));

        // 날짜별 기록 횟수 집계
        List<HabitRecord> records = habitRecordRepository
                .findByHabitIdAndRecordDateBetweenAndIsDeletedFalse(habitId, startDate, endDate);

        Map<LocalDate, Long> recordCountByDate = records.stream()
                .collect(Collectors.groupingBy(
                        HabitRecord::getRecordDate,
                        Collectors.counting()
                ));

        return HabitCalendarResponse.builder()
                .yearMonth(YearMonth.from(startDate))
                .recordCountByDate(recordCountByDate)
                .build();
    }
}
