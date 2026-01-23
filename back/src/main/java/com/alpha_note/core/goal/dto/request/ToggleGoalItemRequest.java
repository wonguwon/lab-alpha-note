package com.alpha_note.core.goal.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ToggleGoalItemRequest {

    @NotNull(message = "목표 인덱스는 필수입니다")
    private Integer goalIndex;
}

