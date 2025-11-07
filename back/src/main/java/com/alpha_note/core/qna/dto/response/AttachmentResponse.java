package com.alpha_note.core.qna.dto.response;

import com.alpha_note.core.qna.entity.AnswerAttachment;
import com.alpha_note.core.qna.entity.QuestionAttachment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttachmentResponse {

    private Long id;
    private String fileName;
    private Long fileSize;
    private String contentType;
    private String cdnUrl;
    private Long uploadedBy;
    private Instant createdAt;

    public static AttachmentResponse from(QuestionAttachment attachment) {
        return AttachmentResponse.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .fileSize(attachment.getFileSize())
                .contentType(attachment.getContentType())
                .cdnUrl(attachment.getCdnUrl())
                .uploadedBy(attachment.getUploadedBy())
                .createdAt(attachment.getCreatedAt())
                .build();
    }

    public static AttachmentResponse from(AnswerAttachment attachment) {
        return AttachmentResponse.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .fileSize(attachment.getFileSize())
                .contentType(attachment.getContentType())
                .cdnUrl(attachment.getCdnUrl())
                .uploadedBy(attachment.getUploadedBy())
                .createdAt(attachment.getCreatedAt())
                .build();
    }
}
