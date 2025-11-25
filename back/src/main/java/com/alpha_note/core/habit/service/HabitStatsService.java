package com.alpha_note.core.habit.service;

import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.habit.dto.response.HabitStatsResponse;
import com.alpha_note.core.habit.entity.Habit;
import com.alpha_note.core.habit.enums.HabitStatus;
import com.alpha_note.core.habit.repository.HabitRecordRepository;
import com.alpha_note.core.habit.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HabitStatsService {

    private final HabitRecordRepository habitRecordRepository;
    private final HabitRepository habitRepository;

    /**
     * 습관 통계 조회 (비로그인 허용)
     */
    public HabitStatsResponse getStats(Long habitId) {
        // 습관 조회
        Habit habit = habitRepository.findByIdAndStatusNot(habitId, HabitStatus.DELETED)
                .orElseThrow(() -> new CustomException(ErrorCode.HABIT_NOT_FOUND));

        // 기록된 날짜 개수 (중복 제거)
        long totalDays = habitRecordRepository.countDistinctRecordDatesByHabitId(habitId);

        // 전체 횟수 합계 (습관 시작부터 현재까지)
        Integer totalCount = habitRecordRepository.sumCountByHabitIdAndDateRange(
                habitId,
                habit.getStartDate(),
                LocalDate.now()
        );

        return HabitStatsResponse.builder()
                .currentStreak(habit.getCurrentStreak())
                .longestStreak(habit.getLongestStreak())
                .totalRecords(habit.getTotalRecords())
                .totalDays(totalDays)
                .totalCount(totalCount != null ? totalCount : 0)
                .build();
    }

    /**
     * 특정 기간의 통계 조회 (비로그인 허용)
     */
    public HabitStatsResponse getStatsByDateRange(
            Long habitId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        // 습관 조회
        Habit habit = habitRepository.findByIdAndStatusNot(habitId, HabitStatus.DELETED)
                .orElseThrow(() -> new CustomException(ErrorCode.HABIT_NOT_FOUND));

        // 기간 내 횟수 합계
        Integer totalCount = habitRecordRepository.sumCountByHabitIdAndDateRange(
                habitId,
                startDate,
                endDate
        );

        // 기간 내 기록된 날짜 개수는 별도로 계산하거나 생략 가능
        // 여기서는 간단히 전체 통계를 반환

        return HabitStatsResponse.builder()
                .currentStreak(habit.getCurrentStreak())
                .longestStreak(habit.getLongestStreak())
                .totalRecords(habit.getTotalRecords())
                .totalDays(0L)  // 기간별 날짜 개수는 필요시 추가 구현
                .totalCount(totalCount != null ? totalCount : 0)
                .build();
    }
}
