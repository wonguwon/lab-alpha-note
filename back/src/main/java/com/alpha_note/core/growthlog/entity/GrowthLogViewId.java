package com.alpha_note.core.growthlog.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * GrowthLogView 복합키
 * - growthLogId + userId
 */
@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class GrowthLogViewId implements Serializable {

    @Column(name = "growth_log_id")
    private Long growthLogId;

    @Column(name = "user_id")
    private Long userId;
}
