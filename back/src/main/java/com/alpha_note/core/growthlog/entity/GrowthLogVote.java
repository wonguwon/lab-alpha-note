package com.alpha_note.core.growthlog.entity;

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

    @Column(name = "growth_log_id", nullable = false)
    private Long growthLogId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // ========== 관계 매핑 ==========

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "growth_log_id", insertable = false, updatable = false)
    private GrowthLog growthLog;

}
