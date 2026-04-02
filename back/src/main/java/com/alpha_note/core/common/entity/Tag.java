package com.alpha_note.core.common.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

/**
 * 태그 엔티티
 * - 태그를 붙여 분류 및 검색 용이하게 함
 * - 공통으로 분리
 *   - 대상: 질문(Question), 성장기록(GrowthLog)
 * - N:M 관계 (Target <-> Tag)
 */
@Entity
@Table(name = "tags", indexes = {
        @Index(name = "idx_name", columnList = "name"),
        @Index(name = "idx_is_deleted", columnList = "is_deleted"),
        @Index(name = "idx_use_count", columnList = "use_count")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", unique = true, nullable = false, length = 50)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "use_count", nullable = false)
    @Builder.Default
    private Integer useCount = 0;

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

    // ========== 비즈니스 메소드 ==========

    /**
     * 사용 횟수 증가
     */
    public void incrementUseCount() {
        this.useCount++;
    }

    /**
     * 사용 횟수 감소
     */
    public void decrementUseCount() {
        if (this.useCount > 0) {
            this.useCount--;
        }
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
     * 태그 설명 업데이트
     */
    public void updateDescription(String description) {
        this.description = description;
    }
}
