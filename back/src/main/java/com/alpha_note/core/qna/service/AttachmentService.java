package com.alpha_note.core.qna.service;

import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.qna.dto.response.AttachmentResponse;
import com.alpha_note.core.qna.entity.AnswerAttachment;
import com.alpha_note.core.qna.entity.QuestionAttachment;
import com.alpha_note.core.qna.repository.AnswerAttachmentRepository;
import com.alpha_note.core.qna.repository.QuestionAttachmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final QuestionAttachmentRepository questionAttachmentRepository;
    private final AnswerAttachmentRepository answerAttachmentRepository;

    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList("image/png", "image/jpeg", "image/webp");

    /**
     * 질문 첨부파일 생성 (S3 업로드 후 메타데이터 저장)
     */
    @Transactional
    public AttachmentResponse createQuestionAttachment(Long questionId, Long userId,
                                                       String fileName, Long fileSize,
                                                       String contentType, String s3Key, String cdnUrl) {
        // 이미지 타입 검증
        if (!ALLOWED_IMAGE_TYPES.contains(contentType)) {
            throw new CustomException(ErrorCode.INVALID_IMAGE_TYPE);
        }

        QuestionAttachment attachment = QuestionAttachment.builder()
                .questionId(questionId)
                .fileName(fileName)
                .fileSize(fileSize)
                .contentType(contentType)
                .s3Key(s3Key)
                .cdnUrl(cdnUrl)
                .uploadedBy(userId)
                .build();

        QuestionAttachment saved = questionAttachmentRepository.save(attachment);
        log.info("질문 첨부파일 저장 완료 - attachmentId: {}, questionId: {}", saved.getId(), questionId);

        return AttachmentResponse.from(saved);
    }

    /**
     * 답변 첨부파일 생성 (S3 업로드 후 메타데이터 저장)
     */
    @Transactional
    public AttachmentResponse createAnswerAttachment(Long answerId, Long userId,
                                                     String fileName, Long fileSize,
                                                     String contentType, String s3Key, String cdnUrl) {
        // 이미지 타입 검증
        if (!ALLOWED_IMAGE_TYPES.contains(contentType)) {
            throw new CustomException(ErrorCode.INVALID_IMAGE_TYPE);
        }

        AnswerAttachment attachment = AnswerAttachment.builder()
                .answerId(answerId)
                .fileName(fileName)
                .fileSize(fileSize)
                .contentType(contentType)
                .s3Key(s3Key)
                .cdnUrl(cdnUrl)
                .uploadedBy(userId)
                .build();

        AnswerAttachment saved = answerAttachmentRepository.save(attachment);
        log.info("답변 첨부파일 저장 완료 - attachmentId: {}, answerId: {}", saved.getId(), answerId);

        return AttachmentResponse.from(saved);
    }

    /**
     * 질문 첨부파일 목록 조회
     */
    @Transactional(readOnly = true)
    public List<AttachmentResponse> getQuestionAttachments(Long questionId) {
        List<QuestionAttachment> attachments = questionAttachmentRepository.findByQuestionIdAndIsDeletedFalse(questionId);
        return attachments.stream()
                .map(AttachmentResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 답변 첨부파일 목록 조회
     */
    @Transactional(readOnly = true)
    public List<AttachmentResponse> getAnswerAttachments(Long answerId) {
        List<AnswerAttachment> attachments = answerAttachmentRepository.findByAnswerIdAndIsDeletedFalse(answerId);
        return attachments.stream()
                .map(AttachmentResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 질문 첨부파일 삭제 (Soft Delete)
     */
    @Transactional
    public void deleteQuestionAttachment(Long attachmentId, Long userId) {
        QuestionAttachment attachment = questionAttachmentRepository.findByIdAndIsDeletedFalse(attachmentId)
                .orElseThrow(() -> new CustomException(ErrorCode.ATTACHMENT_NOT_FOUND));

        // 업로드한 사용자만 삭제 가능 (또는 질문 작성자)
        if (!attachment.getUploadedBy().equals(userId)) {
            throw new CustomException(ErrorCode.ACCESS_DENIED);
        }

        attachment.markAsDeleted();
        questionAttachmentRepository.save(attachment);

        log.info("질문 첨부파일 삭제 완료 - attachmentId: {}", attachmentId);
    }

    /**
     * 답변 첨부파일 삭제 (Soft Delete)
     */
    @Transactional
    public void deleteAnswerAttachment(Long attachmentId, Long userId) {
        AnswerAttachment attachment = answerAttachmentRepository.findByIdAndIsDeletedFalse(attachmentId)
                .orElseThrow(() -> new CustomException(ErrorCode.ATTACHMENT_NOT_FOUND));

        // 업로드한 사용자만 삭제 가능 (또는 답변 작성자)
        if (!attachment.getUploadedBy().equals(userId)) {
            throw new CustomException(ErrorCode.ACCESS_DENIED);
        }

        attachment.markAsDeleted();
        answerAttachmentRepository.save(attachment);

        log.info("답변 첨부파일 삭제 완료 - attachmentId: {}", attachmentId);
    }

    /**
     * 허용된 이미지 타입 확인
     */
    public boolean isAllowedImageType(String contentType) {
        return ALLOWED_IMAGE_TYPES.contains(contentType);
    }
}
