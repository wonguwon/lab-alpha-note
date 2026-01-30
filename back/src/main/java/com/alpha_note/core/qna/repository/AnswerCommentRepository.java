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

    // 답변별 댓글 조회 (생성일 내림차순 - 최신순)
    List<AnswerComment> findByAnswerEntity_IdAndIsDeletedFalseOrderByCreatedAtDesc(Long answerId);

    // 사용자별 댓글 조회
    List<AnswerComment> findByUser_IdAndIsDeletedFalseOrderByCreatedAtDesc(Long userId);

    // 댓글 수 카운트
    long countByAnswerEntity_IdAndIsDeletedFalse(Long answerId);
    long countByUser_IdAndIsDeletedFalse(Long userId);

    // 특정 답변의 모든 댓글 조회 (삭제된 것 포함 - Soft Delete 처리용)
    List<AnswerComment> findByAnswerEntity_Id(Long answerId);
}
