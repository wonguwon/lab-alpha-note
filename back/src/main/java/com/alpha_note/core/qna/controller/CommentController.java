package com.alpha_note.core.qna.controller;

import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.qna.dto.request.CreateCommentRequest;
import com.alpha_note.core.qna.dto.response.CommentResponse;
import com.alpha_note.core.qna.service.CommentService;
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
@RequestMapping("/api/v1/qna")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    /**
     * 질문 댓글 작성
     * POST /api/v1/qna/questions/{questionId}/comments
     */
    @PostMapping("/questions/{questionId}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> createQuestionComment(
            @AuthenticationPrincipal User user,
            @PathVariable Long questionId,
            @Valid @RequestBody CreateCommentRequest request) {

        CommentResponse response = commentService.createQuestionComment(questionId, user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("댓글이 성공적으로 작성되었습니다.", response));
    }

    /**
     * 답변 댓글 작성
     * POST /api/v1/qna/answers/{answerId}/comments
     */
    @PostMapping("/answers/{answerId}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> createAnswerComment(
            @AuthenticationPrincipal User user,
            @PathVariable Long answerId,
            @Valid @RequestBody CreateCommentRequest request) {

        CommentResponse response = commentService.createAnswerComment(answerId, user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("댓글이 성공적으로 작성되었습니다.", response));
    }

    /**
     * 질문 댓글 목록 조회
     * GET /api/v1/qna/questions/{questionId}/comments
     */
    @GetMapping("/questions/{questionId}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getQuestionComments(
            @PathVariable Long questionId) {

        List<CommentResponse> response = commentService.getQuestionComments(questionId);
        return ResponseEntity.ok(ApiResponse.success("댓글 목록 조회 성공", response));
    }

    /**
     * 답변 댓글 목록 조회
     * GET /api/v1/qna/answers/{answerId}/comments
     */
    @GetMapping("/answers/{answerId}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getAnswerComments(
            @PathVariable Long answerId) {

        List<CommentResponse> response = commentService.getAnswerComments(answerId);
        return ResponseEntity.ok(ApiResponse.success("댓글 목록 조회 성공", response));
    }

    /**
     * 질문 댓글 수정
     * PUT /api/v1/qna/comments/question/{commentId}
     */
    @PutMapping("/comments/question/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateQuestionComment(
            @AuthenticationPrincipal User user,
            @PathVariable Long commentId,
            @Valid @RequestBody CreateCommentRequest request) {

        CommentResponse response = commentService.updateQuestionComment(commentId, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("댓글이 성공적으로 수정되었습니다.", response));
    }

    /**
     * 답변 댓글 수정
     * PUT /api/v1/qna/comments/answer/{commentId}
     */
    @PutMapping("/comments/answer/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateAnswerComment(
            @AuthenticationPrincipal User user,
            @PathVariable Long commentId,
            @Valid @RequestBody CreateCommentRequest request) {

        CommentResponse response = commentService.updateAnswerComment(commentId, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("댓글이 성공적으로 수정되었습니다.", response));
    }

    /**
     * 질문 댓글 삭제 (Soft Delete)
     * DELETE /api/v1/qna/comments/question/{commentId}
     */
    @DeleteMapping("/comments/question/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestionComment(
            @AuthenticationPrincipal User user,
            @PathVariable Long commentId) {

        commentService.deleteQuestionComment(commentId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("댓글이 성공적으로 삭제되었습니다.", null));
    }

    /**
     * 답변 댓글 삭제 (Soft Delete)
     * DELETE /api/v1/qna/comments/answer/{commentId}
     */
    @DeleteMapping("/comments/answer/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteAnswerComment(
            @AuthenticationPrincipal User user,
            @PathVariable Long commentId) {

        commentService.deleteAnswerComment(commentId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("댓글이 성공적으로 삭제되었습니다.", null));
    }
}
