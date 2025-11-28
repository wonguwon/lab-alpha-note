package com.alpha_note.core.habit.controller;

import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.habit.dto.request.CreateHabitRequest;
import com.alpha_note.core.habit.dto.request.UpdateHabitRequest;
import com.alpha_note.core.habit.dto.response.HabitDashboardResponse;
import com.alpha_note.core.habit.dto.response.HabitResponse;
import com.alpha_note.core.habit.dto.response.HabitStatsResponse;
import com.alpha_note.core.habit.dto.response.HabitWithCalendarDTO;
import com.alpha_note.core.habit.enums.HabitSearchType;
import com.alpha_note.core.habit.enums.HabitSortType;
import com.alpha_note.core.habit.enums.HabitStatus;
import com.alpha_note.core.habit.service.HabitService;
import com.alpha_note.core.habit.service.HabitStatsService;
import com.alpha_note.core.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;
    private final HabitStatsService habitStatsService;

    /**
     * 습관 생성
     */
    @PostMapping
    public ResponseEntity<ApiResponse<HabitResponse>> createHabit(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateHabitRequest request
    ) {
        HabitResponse response = habitService.createHabit(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("습관이 성공적으로 생성되었습니다.", response));
    }

    /**
     * 습관 목록 조회 (비로그인 허용)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<HabitResponse>>> getHabits(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) HabitStatus status,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        // userId 파라미터가 있으면 해당 사용자의 습관, 없으면 전체 조회 (로그인 여부 무관)
        Page<HabitResponse> response = habitService.getHabits(userId, status, pageable);
        return ResponseEntity.ok(ApiResponse.success("습관 목록 조회 성공", response));
    }

    /**
     * 습관 대시보드 조회 (습관 목록 + 잔디 캘린더 데이터)
     * 프론트엔드에서 한 번의 API 호출로 모든 데이터를 받을 수 있도록 최적화
     *
     * @param user 로그인한 사용자 (선택)
     * @param userId 조회할 사용자 ID (선택, 없으면 전체 조회)
     * @param status 습관 상태 필터 (ACTIVE, ARCHIVED 등)
     * @param keyword 검색 키워드 (선택)
     * @param searchType 검색 타입 (ALL, TITLE, AUTHOR, 기본값: ALL)
     * @param sortType 정렬 타입 (LATEST, CURRENT_STREAK, LONGEST_STREAK, 기본값: LATEST)
     * @param expired 종료일 필터 (true: 종료일 지난 것만, false: 안 지난 것만, null: 전체)
     * @param startMonth 잔디 시작 월 (YYYY-MM 형식, 기본값: 현재-6개월)
     * @param endMonth 잔디 종료 월 (YYYY-MM 형식, 기본값: 현재월)
     * @param pageable 페이징 정보
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<HabitDashboardResponse>> getHabitDashboard(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) HabitStatus status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "ALL") HabitSearchType searchType,
            @RequestParam(required = false, defaultValue = "LATEST") HabitSortType sortType,
            @RequestParam(required = false) Boolean expired,
            @RequestParam(required = false) String startMonth,
            @RequestParam(required = false) String endMonth,
            @PageableDefault(size = 20)
            Pageable pageable
    ) {
        // userId 파라미터가 있으면 해당 사용자의 습관, 없으면 전체 조회 (로그인 여부 무관)
        Page<HabitWithCalendarDTO> page = habitService.getHabitDashboard(
                userId, status, keyword, searchType, sortType, expired, startMonth, endMonth, pageable
        );
        HabitDashboardResponse response = HabitDashboardResponse.from(page);
        return ResponseEntity.ok(ApiResponse.success("대시보드 조회 성공", response));
    }

    /**
     * 습관 상세 조회 (비로그인 허용)
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HabitResponse>> getHabit(
            @PathVariable Long id
    ) {
        HabitResponse response = habitService.getHabit(id);
        return ResponseEntity.ok(ApiResponse.success("습관 조회 성공", response));
    }

    /**
     * 습관 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HabitResponse>> updateHabit(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody UpdateHabitRequest request
    ) {
        HabitResponse response = habitService.updateHabit(id, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("습관이 성공적으로 수정되었습니다.", response));
    }

    /**
     * 습관 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHabit(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        habitService.deleteHabit(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("습관이 성공적으로 삭제되었습니다.", null));
    }

    /**
     * 습관 보관
     */
    @PostMapping("/{id}/archive")
    public ResponseEntity<ApiResponse<HabitResponse>> archiveHabit(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        HabitResponse response = habitService.archiveHabit(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("습관이 보관되었습니다.", response));
    }

    /**
     * 습관 활성화 (보관 해제)
     */
    @PostMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<HabitResponse>> activateHabit(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        HabitResponse response = habitService.activateHabit(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("습관이 활성화되었습니다.", response));
    }

    /**
     * 습관 통계 조회 (비로그인 허용)
     */
    @GetMapping("/{id}/stats")
    public ResponseEntity<ApiResponse<HabitStatsResponse>> getHabitStats(
            @PathVariable Long id
    ) {
        HabitStatsResponse response = habitStatsService.getStats(id);
        return ResponseEntity.ok(ApiResponse.success("통계 조회 성공", response));
    }
}
