package com.alpha_note.core.habit.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateHabitRequest {

    @NotBlank(message = "습관명은 필수입니다")
    @Size(max = 100, message = "습관명은 100자 이내여야 합니다")
    private String title;

    @Size(max = 1000, message = "설명은 1000자 이내여야 합니다")
    private String description;

    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "색상은 HEX 코드 형식이어야 합니다 (예: #10B981)")
    private String color;

    @NotNull(message = "목표 횟수는 필수입니다")
    @Min(value = 1, message = "목표 횟수는 1 이상이어야 합니다")
    @Max(value = 100, message = "목표 횟수는 100 이하여야 합니다")
    private Integer targetCount;

    @NotNull(message = "시작일은 필수입니다")
    private LocalDate startDate;

    private LocalDate endDate;
}
