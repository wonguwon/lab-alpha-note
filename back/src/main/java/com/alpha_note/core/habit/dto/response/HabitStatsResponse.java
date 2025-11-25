package com.alpha_note.core.habit.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HabitStatsResponse {

    private Integer currentStreak;
    private Integer longestStreak;
    private Integer totalRecords;
    private Long totalDays;  // 기록된 날짜 개수 (중복 제거)
    private Integer totalCount;  // 전체 횟수 합계
}
