package com.alpha_note.core.qna.repository;

import com.alpha_note.core.qna.entity.AnswerComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerCommentRepository extends JpaRepository<AnswerComment, Long> {

    // 기본 조회
    Optional<AnswerComment> findByIdAndIsDeletedFalse(Long id);

    // 답변별 댓글 조회 (생성일 오름차순)
    List<AnswerComment> findByAnswerIdAndIsDeletedFalseOrderByCreatedAtAsc(Long answerId);

    // 사용자별 댓글 조회
    List<AnswerComment> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(Long userId);

    // 댓글 수 카운트
    long countByAnswerIdAndIsDeletedFalse(Long answerId);
    long countByUserIdAndIsDeletedFalse(Long userId);

    // 특정 답변의 모든 댓글 조회 (삭제된 것 포함 - Soft Delete 처리용)
    List<AnswerComment> findByAnswerId(Long answerId);
}
