package com.alpha_note.core.qna.service;

import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.qna.dto.request.CreateAnswerRequest;
import com.alpha_note.core.qna.dto.request.UpdateAnswerRequest;
import com.alpha_note.core.qna.dto.response.AnswerResponse;
import com.alpha_note.core.qna.dto.response.CommentResponse;
import com.alpha_note.core.qna.entity.Answer;
import com.alpha_note.core.qna.entity.AnswerComment;
import com.alpha_note.core.qna.entity.Question;
import com.alpha_note.core.qna.repository.*;
import com.alpha_note.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final AnswerCommentRepository answerCommentRepository;
    private final AnswerVoteRepository answerVoteRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    /**
     * 답변 작성
     */
    @Transactional
    public AnswerResponse createAnswer(Long questionId, Long userId, CreateAnswerRequest request) {
        // 질문 존재 확인
        Question question = questionRepository.findByIdAndIsDeletedFalse(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        // 사용자 검증
        if (!userRepository.existsById(userId)) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        // 답변 생성
        Answer answer = Answer.builder()
                .questionId(questionId)
                .userId(userId)
                .content(request.getContent())
                .build();

        Answer savedAnswer = answerRepository.save(answer);

        // 질문의 답변 수 증가
        question.incrementAnswerCount();
        questionRepository.save(question);

        log.info("답변 작성 완료 - answerId: {}, questionId: {}, userId: {}", savedAnswer.getId(), questionId, userId);

        return buildAnswerResponse(savedAnswer, userId);
    }

    /**
     * 답변 조회 (질문별)
     */
    @Transactional(readOnly = true)
    public List<AnswerResponse> getAnswersByQuestion(Long questionId, Long currentUserId) {
        // 질문 존재 확인
        if (!questionRepository.existsById(questionId)) {
            throw new CustomException(ErrorCode.QUESTION_NOT_FOUND);
        }

        List<Answer> answers = answerRepository.findByQuestionIdOrderByAcceptedAndVotes(questionId);
        return answers.stream()
                .map(answer -> buildAnswerResponse(answer, currentUserId))
                .collect(Collectors.toList());
    }

    /**
     * 답변 조회 (사용자별)
     */
    @Transactional(readOnly = true)
    public Page<AnswerResponse> getAnswersByUser(Long userId, Pageable pageable, Long currentUserId) {
        Page<Answer> answers = answerRepository.findByUserIdAndIsDeletedFalse(userId, pageable);
        return answers.map(answer -> buildAnswerResponse(answer, currentUserId));
    }

    /**
     * 답변 단건 조회
     */
    @Transactional(readOnly = true)
    public AnswerResponse getAnswerById(Long answerId, Long currentUserId) {
        Answer answer = answerRepository.findByIdAndIsDeletedFalse(answerId)
                .orElseThrow(() -> new CustomException(ErrorCode.ANSWER_NOT_FOUND));

        return buildAnswerResponse(answer, currentUserId);
    }

    /**
     * 답변 수정
     */
    @Transactional
    public AnswerResponse updateAnswer(Long answerId, Long userId, UpdateAnswerRequest request) {
        Answer answer = answerRepository.findByIdAndIsDeletedFalse(answerId)
                .orElseThrow(() -> new CustomException(ErrorCode.ANSWER_NOT_FOUND));

        // 작성자 확인
        if (!answer.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.ANSWER_ACCESS_DENIED);
        }

        // 답변 업데이트
        answer.updateContent(request.getContent());
        Answer updatedAnswer = answerRepository.save(answer);

        // 질문의 마지막 활동 시간 업데이트
        questionRepository.findById(answer.getQuestionId()).ifPresent(question -> {
            question.updateLastActivity();
            questionRepository.save(question);
        });

        log.info("답변 수정 완료 - answerId: {}", answerId);
        return buildAnswerResponse(updatedAnswer, userId);
    }

    /**
     * 답변 삭제 (Soft Delete)
     */
    @Transactional
    public void deleteAnswer(Long answerId, Long userId) {
        Answer answer = answerRepository.findByIdAndIsDeletedFalse(answerId)
                .orElseThrow(() -> new CustomException(ErrorCode.ANSWER_NOT_FOUND));

        // 작성자 확인
        if (!answer.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.ANSWER_ACCESS_DENIED);
        }

        // Soft Delete
        answer.markAsDeleted();
        answerRepository.save(answer);

        // 질문의 답변 수 감소
        questionRepository.findById(answer.getQuestionId()).ifPresent(question -> {
            question.decrementAnswerCount();

            // 채택된 답변이었다면 채택 취소
            if (answer.getIsAccepted()) {
                question.unacceptAnswer();
            }

            questionRepository.save(question);
        });

        // 연관 엔티티 Soft Delete
        softDeleteRelatedEntities(answerId);

        log.info("답변 삭제 완료 - answerId: {}", answerId);
    }

    // ========== Private Helper 메소드 ==========

    /**
     * 연관 엔티티 Soft Delete
     */
    private void softDeleteRelatedEntities(Long answerId) {
        // 댓글들 Soft Delete
        List<AnswerComment> comments = answerCommentRepository.findByAnswerId(answerId);
        comments.forEach(comment -> {
            comment.markAsDeleted();
            answerCommentRepository.save(comment);
        });
    }

    /**
     * AnswerResponse 빌드
     */
    private AnswerResponse buildAnswerResponse(Answer answer, Long currentUserId) {
        AnswerResponse response = AnswerResponse.from(answer);

        // 작성자 닉네임 및 프로필 이미지
        userRepository.findById(answer.getUserId()).ifPresent(user -> {
            response.setUserNickname(user.getNickname());
            response.setProfileImageUrl(user.getProfileImageUrl());
        });

        // 추천 여부
        if (currentUserId != null) {
            boolean isVoted = answerVoteRepository.existsByAnswerIdAndUserId(answer.getId(), currentUserId);
            response.setIsVotedByCurrentUser(isVoted);
        }

        // 댓글 개수
        long commentCount = answerCommentRepository.countByAnswerIdAndIsDeletedFalse(answer.getId());
        response.setCommentCount((int) commentCount);

        return response;
    }
}
