package com.alpha_note.core.habit.dto.response;

import com.alpha_note.core.habit.entity.Habit;
import com.alpha_note.core.habit.enums.HabitStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HabitResponse {

    private Long id;
    private Long userId;
    private String title;
    private String description;
    private String color;
    private Integer targetCount;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer totalRecords;
    private HabitStatus status;
    private Instant createdAt;
    private Instant updatedAt;

    /**
     * Entity -> Response DTO 변환
     */
    public static HabitResponse from(Habit habit) {
        return HabitResponse.builder()
                .id(habit.getId())
                .userId(habit.getUserId())
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
                .build();
    }
}
