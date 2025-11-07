package com.alpha_note.core.qna.service;

import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.qna.entity.Answer;
import com.alpha_note.core.qna.entity.AnswerVote;
import com.alpha_note.core.qna.entity.Question;
import com.alpha_note.core.qna.entity.QuestionVote;
import com.alpha_note.core.qna.repository.AnswerRepository;
import com.alpha_note.core.qna.repository.AnswerVoteRepository;
import com.alpha_note.core.qna.repository.QuestionRepository;
import com.alpha_note.core.qna.repository.QuestionVoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class VoteService {

    private final QuestionVoteRepository questionVoteRepository;
    private final AnswerVoteRepository answerVoteRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;

    /**
     * 질문 추천
     */
    @Transactional
    public void voteQuestion(Long questionId, Long userId) {
        // 질문 존재 확인
        Question question = questionRepository.findByIdAndIsDeletedFalse(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        // 중복 추천 체크
        if (questionVoteRepository.existsByQuestionIdAndUserId(questionId, userId)) {
            throw new CustomException(ErrorCode.VOTE_ALREADY_EXISTS);
        }

        // 추천 생성
        QuestionVote vote = QuestionVote.builder()
                .questionId(questionId)
                .userId(userId)
                .build();
        questionVoteRepository.save(vote);

        // 추천 수 증가
        question.incrementVoteCount();
        questionRepository.save(question);

        log.info("질문 추천 완료 - questionId: {}, userId: {}", questionId, userId);
    }

    /**
     * 질문 추천 취소
     */
    @Transactional
    public void unvoteQuestion(Long questionId, Long userId) {
        // 질문 존재 확인
        Question question = questionRepository.findByIdAndIsDeletedFalse(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        // 추천 기록 확인
        if (!questionVoteRepository.existsByQuestionIdAndUserId(questionId, userId)) {
            throw new CustomException(ErrorCode.VOTE_NOT_FOUND);
        }

        // 추천 삭제
        questionVoteRepository.deleteByQuestionIdAndUserId(questionId, userId);

        // 추천 수 감소
        question.decrementVoteCount();
        questionRepository.save(question);

        log.info("질문 추천 취소 완료 - questionId: {}, userId: {}", questionId, userId);
    }

    /**
     * 답변 추천
     */
    @Transactional
    public void voteAnswer(Long answerId, Long userId) {
        // 답변 존재 확인
        Answer answer = answerRepository.findByIdAndIsDeletedFalse(answerId)
                .orElseThrow(() -> new CustomException(ErrorCode.ANSWER_NOT_FOUND));

        // 중복 추천 체크
        if (answerVoteRepository.existsByAnswerIdAndUserId(answerId, userId)) {
            throw new CustomException(ErrorCode.VOTE_ALREADY_EXISTS);
        }

        // 추천 생성
        AnswerVote vote = AnswerVote.builder()
                .answerId(answerId)
                .userId(userId)
                .build();
        answerVoteRepository.save(vote);

        // 추천 수 증가
        answer.incrementVoteCount();
        answerRepository.save(answer);

        log.info("답변 추천 완료 - answerId: {}, userId: {}", answerId, userId);
    }

    /**
     * 답변 추천 취소
     */
    @Transactional
    public void unvoteAnswer(Long answerId, Long userId) {
        // 답변 존재 확인
        Answer answer = answerRepository.findByIdAndIsDeletedFalse(answerId)
                .orElseThrow(() -> new CustomException(ErrorCode.ANSWER_NOT_FOUND));

        // 추천 기록 확인
        if (!answerVoteRepository.existsByAnswerIdAndUserId(answerId, userId)) {
            throw new CustomException(ErrorCode.VOTE_NOT_FOUND);
        }

        // 추천 삭제
        answerVoteRepository.deleteByAnswerIdAndUserId(answerId, userId);

        // 추천 수 감소
        answer.decrementVoteCount();
        answerRepository.save(answer);

        log.info("답변 추천 취소 완료 - answerId: {}, userId: {}", answerId, userId);
    }

    /**
     * 질문 추천 여부 확인
     */
    @Transactional(readOnly = true)
    public boolean isQuestionVoted(Long questionId, Long userId) {
        return questionVoteRepository.existsByQuestionIdAndUserId(questionId, userId);
    }

    /**
     * 답변 추천 여부 확인
     */
    @Transactional(readOnly = true)
    public boolean isAnswerVoted(Long answerId, Long userId) {
        return answerVoteRepository.existsByAnswerIdAndUserId(answerId, userId);
    }
}
