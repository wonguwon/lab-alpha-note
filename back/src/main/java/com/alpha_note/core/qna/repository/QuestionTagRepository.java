package com.alpha_note.core.qna.repository;

import com.alpha_note.core.qna.entity.QuestionTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionTagRepository extends JpaRepository<QuestionTag, Long> {

    // 질문별 태그 조회
    List<QuestionTag> findByQuestionId(Long questionId);

    // 태그별 질문 조회
    List<QuestionTag> findByTagId(Long tagId);

    // 특정 질문-태그 조회
    Optional<QuestionTag> findByQuestionIdAndTagId(Long questionId, Long tagId);

    // 존재 여부
    boolean existsByQuestionIdAndTagId(Long questionId, Long tagId);

    // 질문별 태그 수 카운트
    long countByQuestionId(Long questionId);

    // 태그별 질문 수 카운트
    long countByTagId(Long tagId);

    // 질문별 모든 태그 삭제
    @Modifying
    @Query("DELETE FROM QuestionTag qt WHERE qt.questionId = :questionId")
    void deleteByQuestionId(@Param("questionId") Long questionId);

    // 특정 질문-태그 삭제
    @Modifying
    @Query("DELETE FROM QuestionTag qt WHERE qt.questionId = :questionId AND qt.tagId = :tagId")
    void deleteByQuestionIdAndTagId(@Param("questionId") Long questionId, @Param("tagId") Long tagId);
}
