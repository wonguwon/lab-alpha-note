package com.alpha_note.core.blog.controller;

import com.alpha_note.core.blog.service.BlogCommentService;
import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.qna.dto.request.CreateCommentRequest;
import com.alpha_note.core.qna.dto.response.CommentResponse;
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
@RequestMapping("/api/v1/blogs")
@RequiredArgsConstructor
public class BlogCommentController {

    private final BlogCommentService blogCommentService;

    /**
     * 블로그 댓글 작성
     * POST /api/v1/blogs/{blogId}/comments
     */
    @PostMapping("/{blogId}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> createBlogComment(
            @AuthenticationPrincipal User user,
            @PathVariable Long blogId,
            @Valid @RequestBody CreateCommentRequest request) {

        CommentResponse response = blogCommentService.createBlogComment(blogId, user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("댓글이 성공적으로 작성되었습니다.", response));
    }

    /**
     * 블로그 댓글 목록 조회
     * GET /api/v1/blogs/{blogId}/comments
     */
    @GetMapping("/{blogId}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getBlogComments(
            @PathVariable Long blogId) {

        List<CommentResponse> response = blogCommentService.getBlogComments(blogId);
        return ResponseEntity.ok(ApiResponse.success("댓글 목록 조회 성공", response));
    }
}
