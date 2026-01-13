package com.alpha_note.core.blog.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "blog_comments", indexes = {
        @Index(name = "idx_blog_id", columnList = "blog_id"),
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_is_deleted", columnList = "is_deleted"),
        @Index(name = "idx_created_at", columnList = "created_at")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BlogComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "blog_id", nullable = false)
    private Long blogId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    // ========== 관계 매핑 ==========

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_id", insertable = false, updatable = false)
    private Blog blog;

    // ========== 비즈니스 메소드 ==========

    /**
     * 댓글 수정
     */
    public void updateContent(String content) {
        this.content = content;
    }

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
     * 작성자 확인
     */
    public boolean isOwnedBy(Long userId) {
        return this.userId.equals(userId);
    }
}
