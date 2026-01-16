package com.alpha_note.core.blog.controller;

import com.alpha_note.core.blog.service.BlogVoteService;
import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 블로그 추천 관리 API
 */
@RestController
@RequestMapping("/api/v1/blogs")
@RequiredArgsConstructor
public class BlogVoteController {

    private final BlogVoteService blogVoteService;

    /**
     * 블로그 추천
     * POST /api/v1/blogs/{blogId}/vote
     */
    @PostMapping("/{blogId}/vote")
    public ResponseEntity<ApiResponse<Void>> voteBlog(
            @AuthenticationPrincipal User user,
            @PathVariable Long blogId) {

        blogVoteService.voteBlog(blogId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("블로그 추천 완료", null));
    }

    /**
     * 블로그 추천 취소
     * DELETE /api/v1/blogs/{blogId}/vote
     */
    @DeleteMapping("/{blogId}/vote")
    public ResponseEntity<ApiResponse<Void>> unvoteBlog(
            @AuthenticationPrincipal User user,
            @PathVariable Long blogId) {

        blogVoteService.unvoteBlog(blogId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("블로그 추천 취소 완료", null));
    }

    /**
     * 블로그 추천 여부 확인
     * GET /api/v1/blogs/{blogId}/vote/check
     */
    @GetMapping("/{blogId}/vote/check")
    public ResponseEntity<ApiResponse<Boolean>> isBlogVoted(
            @AuthenticationPrincipal User user,
            @PathVariable Long blogId) {

        boolean isVoted = blogVoteService.isBlogVoted(blogId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("추천 여부 조회 성공", isVoted));
    }
}
