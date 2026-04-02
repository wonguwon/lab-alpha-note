package com.alpha_note.core.growthlog.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 * 성장기록 조회 기록 엔티티
 * - 사용자별 성장기록 조회 여부 추적
 * - 조회수 중복 방지에 사용
 */
@Entity
@Table(name = "growth_log_views", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_viewed_at", columnList = "viewed_at")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class GrowthLogView {

    @EmbeddedId
    private GrowthLogViewId id;

    @Column(name = "viewed_at", nullable = false, updatable = false)
    @CreationTimestamp
    private Instant viewedAt;

    public static GrowthLogView of(Long growthLogId, Long userId) {
        return GrowthLogView.builder()
                .id(new GrowthLogViewId(growthLogId, userId))
                .build();
    }

}
