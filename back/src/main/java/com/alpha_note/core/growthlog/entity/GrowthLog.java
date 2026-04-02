package com.alpha_note.core.growthlog.entity;

import com.alpha_note.core.growthlog.enums.GrowthLogStatus;
import com.alpha_note.core.growthlog.enums.GrowthLogVisibility;
import com.alpha_note.core.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * 성장기록 엔티티
 * - 사용자가 작성한 성장기록
 * - 댓글, 태그와 관계
 * - 이미지는 content 필드에 마크다운 형식으로 임베드
 */
@Entity
@Table(name = "growth_logs", indexes = {
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
public class GrowthLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "thumbnail_url", length = 1000)
    private String thumbnailUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private GrowthLogStatus status = GrowthLogStatus.PUBLISHED;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false, length = 20)
    @Builder.Default
    private GrowthLogVisibility visibility = GrowthLogVisibility.PUBLIC;

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

    @OneToMany(mappedBy = "growthLog", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<GrowthLogTag> growthLogTags = new ArrayList<>();

    @OneToMany(mappedBy = "growthLogEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<GrowthLogComment> comments = new ArrayList<>();

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
     * 성장기록 수정
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
     * 성장기록 수정 (상태, 공개 범위 포함)
     */
    public void update(String title, String content, String thumbnailUrl, GrowthLogStatus status, GrowthLogVisibility visibility) {
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
     * 성장기록 발행
     */
    public void publish() {
        this.status = GrowthLogStatus.PUBLISHED;
        this.updateLastActivity();
    }

    /**
     * 공개 범위 변경
     */
    public void changeVisibility(GrowthLogVisibility visibility) {
        this.visibility = visibility;
        this.updateLastActivity();
    }

    /**
     * 발행 상태 확인
     */
    public boolean isPublished() {
        return this.status == GrowthLogStatus.PUBLISHED;
    }

    /**
     * 공개 상태 확인
     */
    public boolean isPublic() {
        return this.visibility == GrowthLogVisibility.PUBLIC;
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
     * 편의 메서드 (하위 호환성)
     */
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    /**
     * 작성자 확인
     */
    public boolean isOwnedBy(Long userId) {
        return this.user != null && this.user.getId().equals(userId);
    }
}
