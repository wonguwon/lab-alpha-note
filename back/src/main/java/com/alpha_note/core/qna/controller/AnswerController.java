package com.alpha_note.core.qna.controller;

import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.qna.dto.request.CreateAnswerRequest;
import com.alpha_note.core.qna.dto.request.UpdateAnswerRequest;
import com.alpha_note.core.qna.dto.response.AnswerResponse;
import com.alpha_note.core.qna.service.AnswerService;
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

import java.util.List;

/**
 * 답변 관리 API
 */
@RestController
@RequestMapping("/api/v1/qna")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    /**
     * 답변 작성
     * POST /api/v1/qna/questions/{questionId}/answers
     */
    @PostMapping("/questions/{questionId}/answers")
    public ResponseEntity<ApiResponse<AnswerResponse>> createAnswer(
            @AuthenticationPrincipal User user,
            @PathVariable Long questionId,
            @Valid @RequestBody CreateAnswerRequest request) {

        AnswerResponse response = answerService.createAnswer(questionId, user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("답변이 성공적으로 작성되었습니다.", response));
    }

    /**
     * 질문별 답변 목록 조회
     * GET /api/v1/qna/questions/{questionId}/answers
     */
    @GetMapping("/questions/{questionId}/answers")
    public ResponseEntity<ApiResponse<List<AnswerResponse>>> getAnswersByQuestion(
            @AuthenticationPrincipal User user,
            @PathVariable Long questionId) {

        Long userId = (user != null) ? user.getId() : null;
        List<AnswerResponse> response = answerService.getAnswersByQuestion(questionId, userId);
        return ResponseEntity.ok(ApiResponse.success("답변 목록 조회 성공", response));
    }

    /**
     * 사용자별 답변 목록 조회
     * GET /api/v1/qna/users/{userId}/answers
     */
    @GetMapping("/users/{userId}/answers")
    public ResponseEntity<ApiResponse<Page<AnswerResponse>>> getAnswersByUser(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Long currentUserId = (user != null) ? user.getId() : null;
        Page<AnswerResponse> response = answerService.getAnswersByUser(userId, pageable, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("사용자별 답변 조회 성공", response));
    }

    /**
     * 답변 단건 조회
     * GET /api/v1/qna/answers/{answerId}
     */
    @GetMapping("/answers/{answerId}")
    public ResponseEntity<ApiResponse<AnswerResponse>> getAnswer(
            @AuthenticationPrincipal User user,
            @PathVariable Long answerId) {

        Long currentUserId = (user != null) ? user.getId() : null;
        AnswerResponse response = answerService.getAnswerById(answerId, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("답변 조회 성공", response));
    }

    /**
     * 답변 수정
     * PUT /api/v1/qna/answers/{answerId}
     */
    @PutMapping("/answers/{answerId}")
    public ResponseEntity<ApiResponse<AnswerResponse>> updateAnswer(
            @AuthenticationPrincipal User user,
            @PathVariable Long answerId,
            @Valid @RequestBody UpdateAnswerRequest request) {

        AnswerResponse response = answerService.updateAnswer(answerId, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("답변이 성공적으로 수정되었습니다.", response));
    }

    /**
     * 답변 삭제 (Soft Delete)
     * DELETE /api/v1/qna/answers/{answerId}
     */
    @DeleteMapping("/answers/{answerId}")
    public ResponseEntity<ApiResponse<Void>> deleteAnswer(
            @AuthenticationPrincipal User user,
            @PathVariable Long answerId) {

        answerService.deleteAnswer(answerId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("답변이 성공적으로 삭제되었습니다.", null));
    }
}
