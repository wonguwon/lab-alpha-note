package com.alpha_note.core.habit.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Map;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HabitCalendarResponse {

    private YearMonth yearMonth;
    private Map<LocalDate, Long> recordCountByDate;  // 날짜별 기록 횟수
}
