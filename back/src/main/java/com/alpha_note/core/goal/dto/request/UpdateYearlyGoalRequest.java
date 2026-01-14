package com.alpha_note.core.goal.dto.request;

import com.alpha_note.core.goal.dto.GoalItem;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateYearlyGoalRequest {

    @Valid
    @NotNull(message = "목표 목록은 필수입니다")
    @Size(min = 1, message = "최소 1개 이상의 목표를 설정해야 합니다")
    private List<GoalItem> goals;
}

