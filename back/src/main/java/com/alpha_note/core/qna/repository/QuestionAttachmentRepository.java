package com.alpha_note.core.qna.repository;

import com.alpha_note.core.qna.entity.QuestionAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionAttachmentRepository extends JpaRepository<QuestionAttachment, Long> {

    // 기본 조회
    Optional<QuestionAttachment> findByIdAndIsDeletedFalse(Long id);

    // 질문별 첨부파일 조회
    List<QuestionAttachment> findByQuestionIdAndIsDeletedFalse(Long questionId);

    // S3 키로 조회
    Optional<QuestionAttachment> findByS3KeyAndIsDeletedFalse(String s3Key);

    // 업로더별 조회
    List<QuestionAttachment> findByUploadedByAndIsDeletedFalse(Long userId);

    // 첨부파일 수 카운트
    long countByQuestionIdAndIsDeletedFalse(Long questionId);

    // 특정 질문의 모든 첨부파일 조회 (삭제된 것 포함 - Soft Delete 처리용)
    List<QuestionAttachment> findByQuestionId(Long questionId);
}
