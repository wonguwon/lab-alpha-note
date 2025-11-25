package com.alpha_note.core.habit.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * 습관 대시보드 전체 데이터를 반환하는 DTO
 * 습관 목록 + 각 습관의 잔디 캘린더 데이터를 포함
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HabitDashboardResponse {

    private List<HabitWithCalendarDTO> habits;
    private Long totalElements;
    private Integer totalPages;
    private Integer currentPage;
    private Integer pageSize;

    /**
     * Page<Habit>과 캘린더 데이터 맵으로 응답 생성
     */
    public static HabitDashboardResponse from(Page<HabitWithCalendarDTO> page) {
        return HabitDashboardResponse.builder()
                .habits(page.getContent())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .currentPage(page.getNumber())
                .pageSize(page.getSize())
                .build();
    }
}
