package com.alpha_note.core.qna.repository;

import com.alpha_note.core.qna.entity.Answer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    // 기본 조회
    Optional<Answer> findByIdAndIsDeletedFalse(Long id);

    // 질문별 답변 조회
    List<Answer> findByQuestionEntity_IdAndIsDeletedFalse(Long questionId);
    Page<Answer> findByQuestionEntity_IdAndIsDeletedFalse(Long questionId, Pageable pageable);

    // 질문별 답변 조회 (투표수 내림차순)
    List<Answer> findByQuestionEntity_IdAndIsDeletedFalseOrderByVoteCountDesc(Long questionId);

    // 질문별 답변 조회 (채택된 답변 먼저, 그 다음 최신순)
    @Query("SELECT a FROM Answer a WHERE a.questionEntity.id = :questionId AND a.isDeleted = false ORDER BY a.isAccepted DESC, a.createdAt DESC")
    List<Answer> findByQuestionIdOrderByAcceptedAndVotes(@Param("questionId") Long questionId);

    // 사용자별 답변 조회 (최신순)
    Page<Answer> findByUser_IdAndIsDeletedFalseOrderByCreatedAtDesc(Long userId, Pageable pageable);
    List<Answer> findByUser_IdAndIsDeletedFalseOrderByCreatedAtDesc(Long userId);

    // 채택된 답변 조회
    Optional<Answer> findByQuestionEntity_IdAndIsAcceptedTrueAndIsDeletedFalse(Long questionId);

    // 답변 수 카운트
    long countByQuestionEntity_IdAndIsDeletedFalse(Long questionId);
    long countByUser_IdAndIsDeletedFalse(Long userId);

    // 채택된 답변 수 (사용자별)
    long countByUser_IdAndIsAcceptedTrueAndIsDeletedFalse(Long userId);

    // 질문별 답변 존재 여부
    boolean existsByQuestionEntity_IdAndIsDeletedFalse(Long questionId);
}
