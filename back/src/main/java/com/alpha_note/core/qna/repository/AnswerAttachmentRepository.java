package com.alpha_note.core.qna.repository;

import com.alpha_note.core.qna.entity.AnswerAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerAttachmentRepository extends JpaRepository<AnswerAttachment, Long> {

    // 기본 조회
    Optional<AnswerAttachment> findByIdAndIsDeletedFalse(Long id);

    // 답변별 첨부파일 조회
    List<AnswerAttachment> findByAnswerIdAndIsDeletedFalse(Long answerId);

    // S3 키로 조회
    Optional<AnswerAttachment> findByS3KeyAndIsDeletedFalse(String s3Key);

    // 업로더별 조회
    List<AnswerAttachment> findByUploadedByAndIsDeletedFalse(Long userId);

    // 첨부파일 수 카운트
    long countByAnswerIdAndIsDeletedFalse(Long answerId);

    // 특정 답변의 모든 첨부파일 조회 (삭제된 것 포함 - Soft Delete 처리용)
    List<AnswerAttachment> findByAnswerId(Long answerId);
}
