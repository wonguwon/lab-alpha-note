package com.alpha_note.core.habit.dto.response;

import com.alpha_note.core.habit.entity.HabitRecord;
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
public class HabitRecordResponse {

    private Long id;
    private Long habitId;
    private Long userId;
    private LocalDate recordDate;
    private Instant loggedAt;
    private Integer count;
    private String note;
    private Instant createdAt;
    private Instant updatedAt;

    /**
     * Entity -> Response DTO 변환
     */
    public static HabitRecordResponse from(HabitRecord record) {
        return HabitRecordResponse.builder()
                .id(record.getId())
                .habitId(record.getHabitId())
                .userId(record.getUserId())
                .recordDate(record.getRecordDate())
                .loggedAt(record.getLoggedAt())
                .count(record.getCount())
                .note(record.getNote())
                .createdAt(record.getCreatedAt())
                .updatedAt(record.getUpdatedAt())
                .build();
    }
}
