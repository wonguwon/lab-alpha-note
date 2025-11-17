package com.alpha_note.core.qna.service;

import com.alpha_note.core.qna.entity.QuestionView;
import com.alpha_note.core.qna.entity.QuestionViewId;
import com.alpha_note.core.qna.repository.QuestionViewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * RDS 기반 조회수 추적 서비스
 * - question_views 테이블에 조회 기록 저장
 * - 나중에 RedisViewCountService로 전환 가능
 */
@Slf4j
@Service
@Primary
@RequiredArgsConstructor
public class RdsViewCountService implements ViewCountService {

    private final QuestionViewRepository questionViewRepository;

    /**
     * 사용자가 특정 질문을 이미 조회했는지 확인
     */
    @Override
    @Transactional(readOnly = true)
    public boolean hasViewed(Long questionId, Long userId) {
        return questionViewRepository.existsByIdQuestionIdAndIdUserId(questionId, userId);
    }

    /**
     * 사용자의 질문 조회 기록 저장
     */
    @Override
    @Transactional
    public void recordView(Long questionId, Long userId) {
        // 이미 조회 기록이 있으면 저장하지 않음 (중복 방지)
        QuestionViewId viewId = new QuestionViewId(questionId, userId);
        if (!questionViewRepository.existsById(viewId)) {
            QuestionView view = QuestionView.of(questionId, userId);
            questionViewRepository.save(view);
            log.debug("질문 조회 기록 저장 - questionId: {}, userId: {}", questionId, userId);
        }
    }
}
