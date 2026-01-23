package com.alpha_note.core.habit.entity;

import com.alpha_note.core.habit.enums.HabitStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "habits", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "color", length = 7)
    @Builder.Default
    private String color = "#10B981";  // Tailwind green-500

    @Column(name = "target_count", nullable = false)
    @Builder.Default
    private Integer targetCount = 1;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    // 통계 캐싱 필드
    @Column(name = "current_streak", nullable = false)
    @Builder.Default
    private Integer currentStreak = 0;

    @Column(name = "longest_streak", nullable = false)
    @Builder.Default
    private Integer longestStreak = 0;

    @Column(name = "total_records", nullable = false)
    @Builder.Default
    private Integer totalRecords = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private HabitStatus status = HabitStatus.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    // 양방향 관계 (optional)
    @OneToMany(mappedBy = "habit", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<HabitRecord> records = new ArrayList<>();

    // ========== 비즈니스 메서드 ==========

    /**
     * 습관 정보 수정
     */
    public void update(String title, String description, String color, Integer targetCount, LocalDate endDate) {
        this.title = title;
        this.description = description;
        this.color = color;
        this.targetCount = targetCount;
        this.endDate = endDate;
    }

    /**
     * 습관 보관
     */
    public void archive() {
        this.status = HabitStatus.ARCHIVED;
    }

    /**
     * 습관 활성화 (보관 해제)
     */
    public void activate() {
        this.status = HabitStatus.ACTIVE;
    }

    /**
     * 습관 삭제 (Soft Delete)
     */
    public void markAsDeleted() {
        this.status = HabitStatus.DELETED;
        this.deletedAt = Instant.now();
    }

    /**
     * 권한 확인
     */
    public boolean isOwnedBy(Long userId) {
        return this.userId.equals(userId);
    }

    /**
     * 활성 상태 확인
     */
    public boolean isActive() {
        return this.status == HabitStatus.ACTIVE;
    }

    /**
     * Streak 업데이트 (캐싱)
     */
    public void updateStreak(int currentStreak) {
        this.currentStreak = currentStreak;
        if (currentStreak > this.longestStreak) {
            this.longestStreak = currentStreak;
        }
    }

    /**
     * 기록 횟수 증가
     */
    public void incrementTotalRecords() {
        this.totalRecords++;
    }

    /**
     * 기록 횟수 감소
     */
    public void decrementTotalRecords() {
        if (this.totalRecords > 0) {
            this.totalRecords--;
        }
    }
}
