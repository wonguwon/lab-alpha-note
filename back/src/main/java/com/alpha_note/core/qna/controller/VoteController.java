package com.alpha_note.core.qna.controller;

import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.qna.service.VoteService;
import com.alpha_note.core.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 추천 관리 API
 */
@RestController
@RequestMapping("/api/v1/qna")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    /**
     * 질문 추천
     * POST /api/v1/qna/questions/{questionId}/vote
     */
    @PostMapping("/questions/{questionId}/vote")
    public ResponseEntity<ApiResponse<Void>> voteQuestion(
            @AuthenticationPrincipal User user,
            @PathVariable Long questionId) {

        voteService.voteQuestion(questionId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("질문 추천 완료", null));
    }

    /**
     * 질문 추천 취소
     * DELETE /api/v1/qna/questions/{questionId}/vote
     */
    @DeleteMapping("/questions/{questionId}/vote")
    public ResponseEntity<ApiResponse<Void>> unvoteQuestion(
            @AuthenticationPrincipal User user,
            @PathVariable Long questionId) {

        voteService.unvoteQuestion(questionId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("질문 추천 취소 완료", null));
    }

    /**
     * 답변 추천
     * POST /api/v1/qna/answers/{answerId}/vote
     */
    @PostMapping("/answers/{answerId}/vote")
    public ResponseEntity<ApiResponse<Void>> voteAnswer(
            @AuthenticationPrincipal User user,
            @PathVariable Long answerId) {

        voteService.voteAnswer(answerId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("답변 추천 완료", null));
    }

    /**
     * 답변 추천 취소
     * DELETE /api/v1/qna/answers/{answerId}/vote
     */
    @DeleteMapping("/answers/{answerId}/vote")
    public ResponseEntity<ApiResponse<Void>> unvoteAnswer(
            @AuthenticationPrincipal User user,
            @PathVariable Long answerId) {

        voteService.unvoteAnswer(answerId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("답변 추천 취소 완료", null));
    }

    /**
     * 질문 추천 여부 확인
     * GET /api/v1/qna/questions/{questionId}/vote/check
     */
    @GetMapping("/questions/{questionId}/vote/check")
    public ResponseEntity<ApiResponse<Boolean>> isQuestionVoted(
            @AuthenticationPrincipal User user,
            @PathVariable Long questionId) {

        boolean isVoted = voteService.isQuestionVoted(questionId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("추천 여부 조회 성공", isVoted));
    }

    /**
     * 답변 추천 여부 확인
     * GET /api/v1/qna/answers/{answerId}/vote/check
     */
    @GetMapping("/answers/{answerId}/vote/check")
    public ResponseEntity<ApiResponse<Boolean>> isAnswerVoted(
            @AuthenticationPrincipal User user,
            @PathVariable Long answerId) {

        boolean isVoted = voteService.isAnswerVoted(answerId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("추천 여부 조회 성공", isVoted));
    }
}
