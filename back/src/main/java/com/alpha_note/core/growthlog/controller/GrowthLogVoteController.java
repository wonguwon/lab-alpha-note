package com.alpha_note.core.growthlog.controller;

import com.alpha_note.core.growthlog.service.GrowthLogVoteService;
import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 성장기록 추천 관리 API
 */
@RestController
@RequestMapping("/api/v1/growth-logs")
@RequiredArgsConstructor
public class GrowthLogVoteController {

    private final GrowthLogVoteService growthLogVoteService;

    /**
     * 성장기록 추천
     * POST /api/v1/growth-logs/{growthLogId}/vote
     */
    @PostMapping("/{growthLogId}/vote")
    public ResponseEntity<ApiResponse<Void>> voteGrowthLog(
            @AuthenticationPrincipal User user,
            @PathVariable Long growthLogId) {

        growthLogVoteService.voteGrowthLog(growthLogId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("성장기록 추천 완료", null));
    }

    /**
     * 성장기록 추천 취소
     * DELETE /api/v1/growth-logs/{growthLogId}/vote
     */
    @DeleteMapping("/{growthLogId}/vote")
    public ResponseEntity<ApiResponse<Void>> unvoteGrowthLog(
            @AuthenticationPrincipal User user,
            @PathVariable Long growthLogId) {

        growthLogVoteService.unvoteGrowthLog(growthLogId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("성장기록 추천 취소 완료", null));
    }

    /**
     * 성장기록 추천 여부 확인
     * GET /api/v1/growth-logs/{growthLogId}/vote/check
     */
    @GetMapping("/{growthLogId}/vote/check")
    public ResponseEntity<ApiResponse<Boolean>> isGrowthLogVoted(
            @AuthenticationPrincipal User user,
            @PathVariable Long growthLogId) {

        boolean isVoted = growthLogVoteService.isGrowthLogVoted(growthLogId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("추천 여부 조회 성공", isVoted));
    }
}
