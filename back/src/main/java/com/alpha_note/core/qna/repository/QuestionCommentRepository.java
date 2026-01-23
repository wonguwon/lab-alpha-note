package com.alpha_note.core.qna.repository;

import com.alpha_note.core.qna.entity.QuestionComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionCommentRepository extends JpaRepository<QuestionComment, Long> {

    // 기본 조회
    Optional<QuestionComment> findByIdAndIsDeletedFalse(Long id);

    // 질문별 댓글 조회 (생성일 내림차순 - 최신순)
    List<QuestionComment> findByQuestionIdAndIsDeletedFalseOrderByCreatedAtDesc(Long questionId);

    // 사용자별 댓글 조회
    List<QuestionComment> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(Long userId);

    // 댓글 수 카운트
    long countByQuestionIdAndIsDeletedFalse(Long questionId);
    long countByUserIdAndIsDeletedFalse(Long userId);

    // 특정 질문의 모든 댓글 조회 (삭제된 것 포함 - Soft Delete 처리용)
    List<QuestionComment> findByQuestionId(Long questionId);
}
