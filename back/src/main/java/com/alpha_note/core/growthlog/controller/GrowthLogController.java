package com.alpha_note.core.growthlog.controller;

import com.alpha_note.core.growthlog.enums.GrowthLogSearchType;
import com.alpha_note.core.growthlog.enums.GrowthLogStatus;
import com.alpha_note.core.growthlog.dto.request.ChangeVisibilityRequest;
import com.alpha_note.core.growthlog.dto.request.CreateGrowthLogRequest;
import com.alpha_note.core.growthlog.dto.request.UpdateGrowthLogRequest;
import com.alpha_note.core.growthlog.dto.response.GrowthLogDetailResponse;
import com.alpha_note.core.growthlog.dto.response.GrowthLogResponse;
import com.alpha_note.core.growthlog.service.GrowthLogService;
import com.alpha_note.core.common.response.ApiResponse;
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
@RequestMapping("/api/v1/growth-logs")
@RequiredArgsConstructor
public class GrowthLogController {
    private final GrowthLogService growthLogService;

    /**
     * 성장기록 목록 조회 (페이징)
     * GET /api/v1/growth-logs
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<GrowthLogResponse>>> getGrowthLogs(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Boolean votedByMe,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Long userId = (user != null) ? user.getId() : null;

        Page<GrowthLogResponse> response;
        if (votedByMe != null) {
            response = growthLogService.getFeedGrowthLogs(pageable, userId);
        } else {
            response = growthLogService.getGrowthLogs(pageable, userId);
        }
        return ResponseEntity.ok(ApiResponse.success("성장기록 목록 조회 성공", response));
    }

    /**
     * 성장기록 작성
     * POST /api/v1/growth-logs
     */
    @PostMapping
    public ResponseEntity<ApiResponse<GrowthLogDetailResponse>> createGrowthLog(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateGrowthLogRequest request) {

        GrowthLogDetailResponse response = growthLogService.createGrowthLog(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("성장기록이 성공적으로 작성되었습니다.", response));
    }

    /**
     * 내 성장기록 목록 조회 (상태 필터 가능)
     * GET /api/v1/growth-logs/me?status=DRAFT
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Page<GrowthLogResponse>>> getMyGrowthLogs(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) GrowthLogStatus status,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<GrowthLogResponse> response = growthLogService.getMyGrowthLogs(user.getId(), status, pageable);
        return ResponseEntity.ok(ApiResponse.success("내 성장기록 목록 조회 성공", response));
    }

    /**
     * 내 임시저장 성장기록 갯수 조회
     * GET /api/v1/growth-logs/me/draft-count
     */
    @GetMapping("/me/draft-count")
    public ResponseEntity<ApiResponse<Long>> getMyDraftCount(
            @AuthenticationPrincipal User user) {

        long count = growthLogService.countMyDraftGrowthLogs(user.getId());
        return ResponseEntity.ok(ApiResponse.success("임시저장 성장기록 갯수 조회 성공", count));
    }

    /**
     * 성장기록 검색 (키워드 + 검색 타입)
     * GET /api/v1/growth-logs/search?keyword=...&searchType=TITLE
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<GrowthLogResponse>>> searchGrowthLogs(
            @AuthenticationPrincipal User user,
            @RequestParam String keyword,
            @RequestParam(required = false) Boolean votedByMe,
            @RequestParam(defaultValue = "TITLE") GrowthLogSearchType searchType,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Long userId = (user != null) ? user.getId() : null;

        Page<GrowthLogResponse> response;
        if (votedByMe != null) {
            response =  growthLogService.searchFeedGrowthLogs(keyword, searchType, pageable, userId);
        } else {
            response = growthLogService.searchGrowthLogs(keyword, searchType, pageable, userId);
        }

        return ResponseEntity.ok(ApiResponse.success("성장기록 검색 성공", response));
    }

    /**
     * 성장기록 상세 조회
     * GET /api/v1/growth-logs/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GrowthLogDetailResponse>> getGrowthLog(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        Long userId = (user != null) ? user.getId() : null;
        GrowthLogDetailResponse response = growthLogService.getGrowthLogDetail(id, userId);
        return ResponseEntity.ok(ApiResponse.success("성장기록 상세 조회 성공", response));
    }

    /**
     * 성장기록 삭제 (Soft Delete)
     * DELETE /api/v1/growth-logs/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGrowthLog(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        growthLogService.deleteGrowthLog(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("성장기록이 성공적으로 삭제되었습니다.", null));
    }

    /**
     * 성장기록 수정
     * PUT /api/v1/growth-logs/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GrowthLogDetailResponse>> updateGrowthLog(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody UpdateGrowthLogRequest request) {

        GrowthLogDetailResponse response = growthLogService.updateGrowthLog(id, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("성장기록이 성공적으로 수정되었습니다.", response));
    }

    /**
     * 성장기록 발행 (임시저장 -> 발행)
     * POST /api/v1/growth-logs/{id}/publish
     */
    @PostMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<GrowthLogDetailResponse>> publishGrowthLog(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        GrowthLogDetailResponse response = growthLogService.publishGrowthLog(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("성장기록이 성공적으로 발행되었습니다.", response));
    }

    /**
     * 공개 범위 변경
     * PATCH /api/v1/growth-logs/{id}/visibility
     */
    @PatchMapping("/{id}/visibility")
    public ResponseEntity<ApiResponse<GrowthLogDetailResponse>> changeVisibility(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody ChangeVisibilityRequest request) {

        GrowthLogDetailResponse response = growthLogService.changeVisibility(id, user.getId(), request.getVisibility());
        return ResponseEntity.ok(ApiResponse.success("성장기록 공개 범위가 변경되었습니다.", response));
    }
}
