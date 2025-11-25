package com.alpha_note.core.habit.dto.response;

import com.alpha_note.core.habit.entity.Habit;
import com.alpha_note.core.habit.enums.HabitStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;

/**
 * 습관 정보 + 잔디 캘린더 데이터를 함께 반환하는 DTO
 * 대시보드 페이지에서 한 번의 API 호출로 모든 데이터를 받기 위해 사용
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HabitWithCalendarDTO {

    // 기본 습관 정보
    private Long id;
    private Long userId;
    private String userNickname;
    private String title;
    private String description;
    private String color;
    private Integer targetCount;
    private LocalDate startDate;
    private LocalDate endDate;

    // 통계 정보
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer totalRecords;

    // 상태 정보
    private HabitStatus status;
    private Instant createdAt;
    private Instant updatedAt;

    // 잔디 캘린더 데이터 (날짜별 기록 횟수)
    private Map<LocalDate, Long> calendar;

    /**
     * Habit Entity와 캘린더 데이터로 DTO 생성
     */
    public static HabitWithCalendarDTO from(Habit habit, Map<LocalDate, Long> calendar, String userNickname) {
        return HabitWithCalendarDTO.builder()
                .id(habit.getId())
                .userId(habit.getUserId())
                .userNickname(userNickname)
                .title(habit.getTitle())
                .description(habit.getDescription())
                .color(habit.getColor())
                .targetCount(habit.getTargetCount())
                .startDate(habit.getStartDate())
                .endDate(habit.getEndDate())
                .currentStreak(habit.getCurrentStreak())
                .longestStreak(habit.getLongestStreak())
                .totalRecords(habit.getTotalRecords())
                .status(habit.getStatus())
                .createdAt(habit.getCreatedAt())
                .updatedAt(habit.getUpdatedAt())
                .calendar(calendar)
                .build();
    }
}
