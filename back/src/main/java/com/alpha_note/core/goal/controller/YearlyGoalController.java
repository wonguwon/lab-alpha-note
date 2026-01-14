package com.alpha_note.core.goal.controller;

import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.goal.dto.request.CreateYearlyGoalRequest;
import com.alpha_note.core.goal.dto.request.ToggleGoalItemRequest;
import com.alpha_note.core.goal.dto.request.UpdateYearlyGoalRequest;
import com.alpha_note.core.goal.dto.response.YearlyGoalResponse;
import com.alpha_note.core.goal.service.YearlyGoalService;
import com.alpha_note.core.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 연도별 목표 관리 API
 */
@RestController
@RequestMapping("/api/v1/goals")
@RequiredArgsConstructor
public class YearlyGoalController {

    private final YearlyGoalService yearlyGoalService;

    /**
     * 목표 생성/업데이트
     * POST /api/v1/goals
     */
    @PostMapping
    public ResponseEntity<ApiResponse<YearlyGoalResponse>> createYearlyGoal(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateYearlyGoalRequest request
    ) {
        YearlyGoalResponse response = yearlyGoalService.createYearlyGoal(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("목표가 성공적으로 저장되었습니다.", response));
    }

    /**
     * 목표 수정
     * PATCH /api/v1/goals/{id}
     */
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<YearlyGoalResponse>> updateYearlyGoal(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody UpdateYearlyGoalRequest request
    ) {
        YearlyGoalResponse response = yearlyGoalService.updateYearlyGoal(user.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("목표가 성공적으로 수정되었습니다.", response));
    }

    /**
     * 목표 달성 여부 토글
     * PATCH /api/v1/goals/{id}/toggle
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<YearlyGoalResponse>> toggleGoalItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody ToggleGoalItemRequest request
    ) {
        YearlyGoalResponse response = yearlyGoalService.toggleGoalItem(user.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("목표 달성 여부가 변경되었습니다.", response));
    }

    /**
     * 목표 삭제
     * DELETE /api/v1/goals/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteYearlyGoal(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        yearlyGoalService.deleteYearlyGoal(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("목표가 성공적으로 삭제되었습니다.", null));
    }

    /**
     * 내 목표 조회 (특정 연도)
     * GET /api/v1/goals/me/{year}
     */
    @GetMapping("/me/{year}")
    public ResponseEntity<ApiResponse<YearlyGoalResponse>> getMyYearlyGoal(
            @AuthenticationPrincipal User user,
            @PathVariable Integer year
    ) {
        YearlyGoalResponse response = yearlyGoalService.getYearlyGoal(user.getId(), year);
        return ResponseEntity.ok(ApiResponse.success("목표 조회 성공", response));
    }

    /**
     * 내 모든 목표 조회
     * GET /api/v1/goals/me
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<YearlyGoalResponse>>> getAllMyYearlyGoals(
            @AuthenticationPrincipal User user
    ) {
        List<YearlyGoalResponse> response = yearlyGoalService.getAllYearlyGoals(user.getId());
        return ResponseEntity.ok(ApiResponse.success("목표 목록 조회 성공", response));
    }
}

