package com.alpha_note.core.goal.dto.response;

import com.alpha_note.core.goal.dto.GoalItem;
import com.alpha_note.core.goal.entity.YearlyGoal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class YearlyGoalResponse {

    private Long id;
    private Long userId;
    private Integer year;
    private List<GoalItem> goals;
    private Instant createdAt;
    private Instant updatedAt;

    public static YearlyGoalResponse from(YearlyGoal yearlyGoal) {
        return YearlyGoalResponse.builder()
                .id(yearlyGoal.getId())
                .userId(yearlyGoal.getUserId())
                .year(yearlyGoal.getYear())
                .goals(yearlyGoal.getGoals())
                .createdAt(yearlyGoal.getCreatedAt())
                .updatedAt(yearlyGoal.getUpdatedAt())
                .build();
    }
}

