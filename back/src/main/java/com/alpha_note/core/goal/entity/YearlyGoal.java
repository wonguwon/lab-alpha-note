package com.alpha_note.core.goal.entity;

import com.alpha_note.core.goal.dto.GoalItem;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.List;

/**
 * 연도별 목표 엔티티
 */
@Entity
@Table(name = "yearly_goals", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_year", columnList = "year"),
    @Index(name = "idx_user_year", columnList = "user_id, year")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_year", columnNames = {"user_id", "year"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class YearlyGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "goals", nullable = false, columnDefinition = "JSON")
    @Convert(converter = GoalItemListConverter.class)
    private List<GoalItem> goals;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // ========== 비즈니스 메서드 ==========

    /**
     * 목표 목록 업데이트
     */
    public void updateGoals(List<GoalItem> goals) {
        this.goals = goals;
    }

    /**
     * 특정 인덱스의 목표 달성 여부 토글
     */
    public void toggleGoalItem(int index) {
        if (index < 0 || index >= goals.size()) {
            throw new IllegalArgumentException("Invalid goal index: " + index);
        }
        GoalItem item = goals.get(index);
        item.setCompleted(!item.getCompleted());
    }

    /**
     * 권한 확인
     */
    public boolean isOwnedBy(Long userId) {
        return this.userId.equals(userId);
    }
}

