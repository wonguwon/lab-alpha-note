package com.alpha_note.core.growthlog.controller;

import com.alpha_note.core.growthlog.dto.request.CreateGrowthLogCommentRequest;
import com.alpha_note.core.growthlog.dto.response.GrowthLogCommentResponse;
import com.alpha_note.core.growthlog.service.GrowthLogCommentService;
import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 댓글 관리 API
 */
@RestController
@RequestMapping("/api/v1/growth-logs")
@RequiredArgsConstructor
public class GrowthLogCommentController {

    private final GrowthLogCommentService growthLogCommentService;

    /**
     * 성장기록 댓글 작성
     * POST /api/v1/growth-logs/{growthLogId}/comments
     */
    @PostMapping("/{growthLogId}/comments")
    public ResponseEntity<ApiResponse<GrowthLogCommentResponse>> createGrowthLogComment(
            @AuthenticationPrincipal User user,
            @PathVariable Long growthLogId,
            @Valid @RequestBody CreateGrowthLogCommentRequest request) {

        GrowthLogCommentResponse response = growthLogCommentService.createGrowthLogComment(growthLogId, user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("댓글이 성공적으로 작성되었습니다.", response));
    }

    /**
     * 성장기록 댓글 목록 조회
     * GET /api/v1/growth-logs/{growthLogId}/comments
     */
    @GetMapping("/{growthLogId}/comments")
    public ResponseEntity<ApiResponse<List<GrowthLogCommentResponse>>> getGrowthLogComments(
            @PathVariable Long growthLogId) {

        List<GrowthLogCommentResponse> response = growthLogCommentService.getGrowthLogComments(growthLogId);
        return ResponseEntity.ok(ApiResponse.success("댓글 목록 조회 성공", response));
    }
}
