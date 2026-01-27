package com.alpha_note.core.growthlog.entity;

import com.alpha_note.core.common.entity.Tag;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "growth_log_tags",
        uniqueConstraints = @UniqueConstraint(name = "uk_growth_log_tag", columnNames = {"growth_log_id", "tag_id"}),
        indexes = {
                @Index(name = "idx_tag_id", columnList = "tag_id")
        })
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class GrowthLogTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "growth_log_id", nullable = false)
    private Long growthLogId;

    @Column(name = "tag_id", nullable = false)
    private Long tagId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // ========== 관계 매핑 ==========

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "growth_log_id", insertable = false, updatable = false)
    private GrowthLog growthLog;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", insertable = false, updatable = false)
    private Tag tag;


}
