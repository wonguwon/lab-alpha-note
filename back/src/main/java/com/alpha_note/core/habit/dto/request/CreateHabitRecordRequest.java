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
public class CreateHabitRecordRequest {

    @NotNull(message = "기록 날짜는 필수입니다")
    private LocalDate recordDate;

    @NotNull(message = "횟수는 필수입니다")
    @Min(value = 1, message = "횟수는 1 이상이어야 합니다")
    @Max(value = 100, message = "횟수는 100 이하여야 합니다")
    private Integer count;

    @Size(max = 1000, message = "메모는 1000자 이내여야 합니다")
    private String note;
}
