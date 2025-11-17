package com.alpha_note.core.qna.controller;

import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.qna.dto.request.CreateQuestionRequest;
import com.alpha_note.core.qna.dto.request.UpdateQuestionRequest;
import com.alpha_note.core.qna.dto.response.QuestionDetailResponse;
import com.alpha_note.core.qna.dto.response.QuestionResponse;
import com.alpha_note.core.qna.enums.SearchType;
import com.alpha_note.core.qna.service.QuestionService;
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

/**
 * 질문 관리 API
 */
@RestController
@RequestMapping("/api/v1/qna/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    /**
     * 질문 작성
     * POST /api/v1/qna/questions
     */
    @PostMapping
    public ResponseEntity<ApiResponse<QuestionDetailResponse>> createQuestion(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateQuestionRequest request) {

        QuestionDetailResponse response = questionService.createQuestion(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("질문이 성공적으로 작성되었습니다.", response));
    }

    /**
     * 질문 목록 조회 (페이징)
     * GET /api/v1/qna/questions
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<QuestionResponse>>> getQuestions(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Long userId = (user != null) ? user.getId() : null;
        Page<QuestionResponse> response = questionService.getQuestions(pageable, userId);
        return ResponseEntity.ok(ApiResponse.success("질문 목록 조회 성공", response));
    }

    /**
     * 질문 상세 조회
     * GET /api/v1/qna/questions/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<QuestionDetailResponse>> getQuestion(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        Long userId = (user != null) ? user.getId() : null;
        QuestionDetailResponse response = questionService.getQuestionDetail(id, userId);
        return ResponseEntity.ok(ApiResponse.success("질문 상세 조회 성공", response));
    }

    /**
     * 질문 검색 (키워드 + 검색 타입)
     * GET /api/v1/qna/questions/search?keyword=...&searchType=TITLE
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<QuestionResponse>>> searchQuestions(
            @AuthenticationPrincipal User user,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "ALL") SearchType searchType,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Long userId = (user != null) ? user.getId() : null;
        Page<QuestionResponse> response = questionService.searchQuestions(keyword, searchType, pageable, userId);
        return ResponseEntity.ok(ApiResponse.success("질문 검색 성공", response));
    }

    /**
     * 태그별 질문 조회
     * GET /api/v1/qna/questions/tag/{tagName}
     */
    @GetMapping("/tag/{tagName}")
    public ResponseEntity<ApiResponse<Page<QuestionResponse>>> getQuestionsByTag(
            @AuthenticationPrincipal User user,
            @PathVariable String tagName,
            @PageableDefault(size = 20, sort = "lastActivityAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Long userId = (user != null) ? user.getId() : null;
        Page<QuestionResponse> response = questionService.getQuestionsByTag(tagName, pageable, userId);
        return ResponseEntity.ok(ApiResponse.success("태그별 질문 조회 성공", response));
    }

    /**
     * 사용자별 질문 조회
     * GET /api/v1/qna/questions/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Page<QuestionResponse>>> getQuestionsByUser(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Long currentUserId = (user != null) ? user.getId() : null;
        Page<QuestionResponse> response = questionService.getQuestionsByUser(userId, pageable, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("사용자별 질문 조회 성공", response));
    }

    /**
     * 미답변 질문 조회
     * GET /api/v1/qna/questions/unanswered
     */
    @GetMapping("/unanswered")
    public ResponseEntity<ApiResponse<Page<QuestionResponse>>> getUnansweredQuestions(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Long userId = (user != null) ? user.getId() : null;
        Page<QuestionResponse> response = questionService.getUnansweredQuestions(pageable, userId);
        return ResponseEntity.ok(ApiResponse.success("미답변 질문 조회 성공", response));
    }

    /**
     * 질문 수정
     * PUT /api/v1/qna/questions/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<QuestionDetailResponse>> updateQuestion(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody UpdateQuestionRequest request) {

        QuestionDetailResponse response = questionService.updateQuestion(id, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("질문이 성공적으로 수정되었습니다.", response));
    }

    /**
     * 질문 삭제 (Soft Delete)
     * DELETE /api/v1/qna/questions/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        questionService.deleteQuestion(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("질문이 성공적으로 삭제되었습니다.", null));
    }

    /**
     * 답변 채택
     * POST /api/v1/qna/questions/{questionId}/accept/{answerId}
     */
    @PostMapping("/{questionId}/accept/{answerId}")
    public ResponseEntity<ApiResponse<Void>> acceptAnswer(
            @AuthenticationPrincipal User user,
            @PathVariable Long questionId,
            @PathVariable Long answerId) {

        questionService.acceptAnswer(questionId, answerId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("답변이 채택되었습니다.", null));
    }
}
