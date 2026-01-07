package com.alpha_note.core.qna.service;

import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.qna.dto.request.CreateCommentRequest;
import com.alpha_note.core.qna.dto.response.CommentResponse;
import com.alpha_note.core.qna.entity.AnswerComment;
import com.alpha_note.core.qna.entity.QuestionComment;
import com.alpha_note.core.qna.repository.*;
import com.alpha_note.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {

    private final QuestionCommentRepository questionCommentRepository;
    private final AnswerCommentRepository answerCommentRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;

    /**
     * 질문 댓글 작성
     */
    @Transactional
    public CommentResponse createQuestionComment(Long questionId, Long userId, CreateCommentRequest request) {
        // 질문 존재 확인
        if (!questionRepository.existsById(questionId)) {
            throw new CustomException(ErrorCode.QUESTION_NOT_FOUND);
        }

        // 사용자 검증
        if (!userRepository.existsById(userId)) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        // 댓글 생성
        QuestionComment comment = QuestionComment.builder()
                .questionId(questionId)
                .userId(userId)
                .content(request.getContent())
                .build();

        QuestionComment savedComment = questionCommentRepository.save(comment);

        // 질문의 마지막 활동 시간 업데이트
        questionRepository.findById(questionId).ifPresent(question -> {
            question.updateLastActivity();
            questionRepository.save(question);
        });

        log.info("질문 댓글 작성 완료 - commentId: {}, questionId: {}, userId: {}", savedComment.getId(), questionId, userId);

        return buildQuestionCommentResponse(savedComment);
    }

    /**
     * 답변 댓글 작성
     */
    @Transactional
    public CommentResponse createAnswerComment(Long answerId, Long userId, CreateCommentRequest request) {
        // 답변 존재 확인
        if (!answerRepository.existsById(answerId)) {
            throw new CustomException(ErrorCode.ANSWER_NOT_FOUND);
        }

        // 사용자 검증
        if (!userRepository.existsById(userId)) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        // 댓글 생성
        AnswerComment comment = AnswerComment.builder()
                .answerId(answerId)
                .userId(userId)
                .content(request.getContent())
                .build();

        AnswerComment savedComment = answerCommentRepository.save(comment);

        // 질문의 마지막 활동 시간 업데이트 (답변의 질문)
        answerRepository.findById(answerId).ifPresent(answer -> {
            questionRepository.findById(answer.getQuestionId()).ifPresent(question -> {
                question.updateLastActivity();
                questionRepository.save(question);
            });
        });

        log.info("답변 댓글 작성 완료 - commentId: {}, answerId: {}, userId: {}", savedComment.getId(), answerId, userId);

        return buildAnswerCommentResponse(savedComment);
    }

    /**
     * 질문 댓글 목록 조회
     */
    @Transactional(readOnly = true)
    public List<CommentResponse> getQuestionComments(Long questionId) {
        if (!questionRepository.existsById(questionId)) {
            throw new CustomException(ErrorCode.QUESTION_NOT_FOUND);
        }

        List<QuestionComment> comments = questionCommentRepository.findByQuestionIdAndIsDeletedFalseOrderByCreatedAtDesc(questionId);
        return comments.stream()
                .map(this::buildQuestionCommentResponse)
                .collect(Collectors.toList());
    }

    /**
     * 답변 댓글 목록 조회
     */
    @Transactional(readOnly = true)
    public List<CommentResponse> getAnswerComments(Long answerId) {
        if (!answerRepository.existsById(answerId)) {
            throw new CustomException(ErrorCode.ANSWER_NOT_FOUND);
        }

        List<AnswerComment> comments = answerCommentRepository.findByAnswerIdAndIsDeletedFalseOrderByCreatedAtDesc(answerId);
        return comments.stream()
                .map(this::buildAnswerCommentResponse)
                .collect(Collectors.toList());
    }

    /**
     * 질문 댓글 수정
     */
    @Transactional
    public CommentResponse updateQuestionComment(Long commentId, Long userId, CreateCommentRequest request) {
        QuestionComment comment = questionCommentRepository.findByIdAndIsDeletedFalse(commentId)
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));

        // 작성자 확인
        if (!comment.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.COMMENT_ACCESS_DENIED);
        }

        // 댓글 수정
        comment.updateContent(request.getContent());
        QuestionComment updatedComment = questionCommentRepository.save(comment);

        log.info("질문 댓글 수정 완료 - commentId: {}", commentId);

        return buildQuestionCommentResponse(updatedComment);
    }

    /**
     * 답변 댓글 수정
     */
    @Transactional
    public CommentResponse updateAnswerComment(Long commentId, Long userId, CreateCommentRequest request) {
        AnswerComment comment = answerCommentRepository.findByIdAndIsDeletedFalse(commentId)
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));

        // 작성자 확인
        if (!comment.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.COMMENT_ACCESS_DENIED);
        }

        // 댓글 수정
        comment.updateContent(request.getContent());
        AnswerComment updatedComment = answerCommentRepository.save(comment);

        log.info("답변 댓글 수정 완료 - commentId: {}", commentId);

        return buildAnswerCommentResponse(updatedComment);
    }

    /**
     * 질문 댓글 삭제 (Soft Delete)
     */
    @Transactional
    public void deleteQuestionComment(Long commentId, Long userId) {
        QuestionComment comment = questionCommentRepository.findByIdAndIsDeletedFalse(commentId)
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));

        // 작성자 확인
        if (!comment.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.COMMENT_ACCESS_DENIED);
        }

        // Soft Delete
        comment.markAsDeleted();
        questionCommentRepository.save(comment);

        log.info("질문 댓글 삭제 완료 - commentId: {}", commentId);
    }

    /**
     * 답변 댓글 삭제 (Soft Delete)
     */
    @Transactional
    public void deleteAnswerComment(Long commentId, Long userId) {
        AnswerComment comment = answerCommentRepository.findByIdAndIsDeletedFalse(commentId)
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));

        // 작성자 확인
        if (!comment.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.COMMENT_ACCESS_DENIED);
        }

        // Soft Delete
        comment.markAsDeleted();
        answerCommentRepository.save(comment);

        log.info("답변 댓글 삭제 완료 - commentId: {}", commentId);
    }

    // ========== Private Helper 메소드 ==========

    /**
     * QuestionComment -> CommentResponse 변환
     */
    private CommentResponse buildQuestionCommentResponse(QuestionComment comment) {
        CommentResponse response = CommentResponse.from(comment);

        // 작성자 닉네임 및 프로필 이미지
        userRepository.findById(comment.getUserId()).ifPresent(user -> {
            response.setUserNickname(user.getNickname());
            response.setProfileImageUrl(user.getProfileImageUrl());
        });

        return response;
    }

    /**
     * AnswerComment -> CommentResponse 변환
     */
    private CommentResponse buildAnswerCommentResponse(AnswerComment comment) {
        CommentResponse response = CommentResponse.from(comment);

        // 작성자 닉네임 및 프로필 이미지
        userRepository.findById(comment.getUserId()).ifPresent(user -> {
            response.setUserNickname(user.getNickname());
            response.setProfileImageUrl(user.getProfileImageUrl());
        });

        return response;
    }
}
