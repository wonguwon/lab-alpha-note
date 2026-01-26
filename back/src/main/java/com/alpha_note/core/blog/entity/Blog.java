package com.alpha_note.core.blog.entity;

import com.alpha_note.core.blog.enums.BlogStatus;
import com.alpha_note.core.blog.enums.BlogVisibility;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * 블로그 엔티티
 * - 사용자가 작성한 블로그
 * - 댓글, 태그와 관계
 * - 이미지는 content 필드에 마크다운 형식으로 임베드
 */
@Entity
@Table(name = "blogs", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_is_deleted", columnList = "is_deleted"),
        @Index(name = "idx_created_at", columnList = "created_at"),
        @Index(name = "idx_vote_count", columnList = "vote_count"),
        @Index(name = "idx_status_visibility", columnList = "status, visibility"),
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "thumbnail_url", length = 1000)
    private String thumbnailUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private BlogStatus status = BlogStatus.PUBLISHED;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false, length = 20)
    @Builder.Default
    private BlogVisibility visibility = BlogVisibility.PUBLIC;

    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Integer viewCount = 0;

    @Column(name = "vote_count", nullable = false)
    @Builder.Default
    private Integer voteCount = 0;

    @Column(name = "last_activity_at", nullable = false)
    @Builder.Default
    private Instant lastActivityAt = Instant.now();

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

    // ========== 관계 매핑 (양방향) ==========

    @OneToMany(mappedBy = "blog", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BlogTag> blogTags = new ArrayList<>();

    @OneToMany(mappedBy = "blog", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BlogComment> comments = new ArrayList<>();

    // ========== 비즈니스 메소드 ==========

    /**
     * 조회수 증가
     */
    public void incrementViewCount() {
        this.viewCount++;
    }

    /**
     * 투표수 증가
     */
    public void incrementVoteCount() {
        this.voteCount++;
    }

    /**
     * 투표수 감소
     */
    public void decrementVoteCount() {
        if (this.voteCount > 0) {
            this.voteCount--;
        }
    }

    /**
     * 마지막 활동 시간 업데이트
     */
    public void updateLastActivity() {
        this.lastActivityAt = Instant.now();
    }

    /**
     * 블로그 수정
     * @param title 제목
     * @param content 내용
     */
    public void update(String title, String content, String thumbnailUrl) {
        this.title = title;
        this.content = content;
        this.thumbnailUrl = thumbnailUrl;
        this.updateLastActivity();
    }

    /**
     * 블로그 수정 (상태, 공개 범위 포함)
     */
    public void update(String title, String content, String thumbnailUrl, BlogStatus status, BlogVisibility visibility) {
        this.title = title;
        this.content = content;
        this.thumbnailUrl = thumbnailUrl;
        if (status != null) {
            this.status = status;
        }
        if (visibility != null) {
            this.visibility = visibility;
        }
        this.updateLastActivity();
    }

    /**
     * 블로그 발행
     */
    public void publish() {
        this.status = BlogStatus.PUBLISHED;
        this.updateLastActivity();
    }

    /**
     * 공개 범위 변경
     */
    public void changeVisibility(BlogVisibility visibility) {
        this.visibility = visibility;
        this.updateLastActivity();
    }

    /**
     * 발행 상태 확인
     */
    public boolean isPublished() {
        return this.status == BlogStatus.PUBLISHED;
    }

    /**
     * 공개 상태 확인
     */
    public boolean isPublic() {
        return this.visibility == BlogVisibility.PUBLIC;
    }

    /**
     * Soft Delete (연쇄 삭제는 Service에서 처리)
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
