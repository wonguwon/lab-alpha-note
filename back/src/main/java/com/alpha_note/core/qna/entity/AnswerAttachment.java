package com.alpha_note.core.qna.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 * 답변 첨부 이미지 엔티티
 * - S3에 업로드된 이미지 메타데이터
 * - 지원 형식: PNG, JPEG, WEBP
 */
@Entity
@Table(name = "answer_attachments", indexes = {
        @Index(name = "idx_answer_id", columnList = "answer_id"),
        @Index(name = "idx_uploaded_by", columnList = "uploaded_by"),
        @Index(name = "idx_is_deleted", columnList = "is_deleted"),
        @Index(name = "idx_s3_key", columnList = "s3_key")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AnswerAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "answer_id", nullable = false)
    private Long answerId;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "content_type", nullable = false, length = 50)
    private String contentType;

    @Column(name = "s3_key", nullable = false, length = 500)
    private String s3Key;

    @Column(name = "cdn_url", nullable = false, length = 500)
    private String cdnUrl;

    @Column(name = "uploaded_by", nullable = false)
    private Long uploadedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    // ========== 관계 매핑 ==========

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_id", insertable = false, updatable = false)
    private Answer answer;

    // ========== 비즈니스 메소드 ==========

    /**
     * Soft Delete
     */
    public void markAsDeleted() {
        this.isDeleted = true;
        this.deletedAt = Instant.now();
    }

    /**
     * 복구
     */
    public void restore() {
        this.isDeleted = false;
        this.deletedAt = null;
    }

    /**
     * 허용된 이미지 형식인지 확인
     */
    public boolean isValidImageType() {
        return contentType.equals("image/png") ||
               contentType.equals("image/jpeg") ||
               contentType.equals("image/webp");
    }
}
