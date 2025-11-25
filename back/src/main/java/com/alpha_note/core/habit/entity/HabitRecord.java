package com.alpha_note.core.habit.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "habit_records", indexes = {
    @Index(name = "idx_habit_id", columnList = "habit_id"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_record_date", columnList = "record_date"),
    @Index(name = "idx_is_deleted", columnList = "is_deleted"),
    @Index(name = "idx_habit_date", columnList = "habit_id, record_date, is_deleted")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class HabitRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "habit_id", nullable = false)
    private Long habitId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;  // 날짜 기준 (YYYY-MM-DD)

    @Column(name = "logged_at", nullable = false)
    @Builder.Default
    private Instant loggedAt = Instant.now();  // 실제 기록 시각

    @Column(name = "count", nullable = false)
    @Builder.Default
    private Integer count = 1;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // 읽기 전용 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habit_id", insertable = false, updatable = false)
    private Habit habit;

    // ========== 비즈니스 메서드 ==========

    /**
     * 기록 수정
     */
    public void update(Integer count, String note) {
        this.count = count;
        this.note = note;
    }

    /**
     * 기록 삭제 (Soft Delete)
     */
    public void markAsDeleted() {
        this.isDeleted = true;
    }

    /**
     * 권한 확인
     */
    public boolean isOwnedBy(Long userId) {
        return this.userId.equals(userId);
    }

    /**
     * 오늘 기록인지 확인
     */
    public boolean isToday() {
        return this.recordDate.equals(LocalDate.now());
    }
}
