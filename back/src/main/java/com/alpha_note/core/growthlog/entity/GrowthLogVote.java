package com.alpha_note.core.growthlog.entity;

import com.alpha_note.core.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "growth_log_votes",
        uniqueConstraints = @UniqueConstraint(name = "uk_growth_log_user_vote", columnNames = {"growth_log_id", "user_id"}),
        indexes = {
                @Index(name = "idx_user_id", columnList = "user_id")
        })
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class GrowthLogVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "growth_log_id", nullable = false)
    private GrowthLog growthLogEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // ========== 편의 메서드 (하위 호환성) ==========

    public Long getGrowthLogId() {
        return growthLogEntity != null ? growthLogEntity.getId() : null;
    }

    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    public GrowthLog getGrowthLog() {
        return growthLogEntity;
    }

}
