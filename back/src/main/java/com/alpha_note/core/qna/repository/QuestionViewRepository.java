package com.alpha_note.core.qna.repository;

import com.alpha_note.core.qna.entity.QuestionView;
import com.alpha_note.core.qna.entity.QuestionViewId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionViewRepository extends JpaRepository<QuestionView, QuestionViewId> {

    /**
     * 특정 사용자가 특정 질문을 조회한 적이 있는지 확인
     */
    boolean existsByIdQuestionIdAndIdUserId(Long questionId, Long userId);
}
