package com.alpha_note.core.notification.entity;

import com.alpha_note.core.notification.enums.NotificationType;
import com.alpha_note.core.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 * 알림 엔티티
 */
@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_user_id_is_read", columnList = "user_id,is_read"),
        @Index(name = "idx_created_at", columnList = "created_at"),
        @Index(name = "idx_user_id", columnList = "user_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 수신자

    // 편의 메서드 (하위 호환성)
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 50)
    private NotificationType type;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "related_entity_type", length = 50)
    private String relatedEntityType; // QUESTION, ANSWER, COMMENT, HABIT 등

    @Column(name = "related_entity_id")
    private Long relatedEntityId;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // ========== 비즈니스 메서드 ==========

    /**
     * 알림 읽음 처리
     */
    public void markAsRead() {
        this.isRead = true;
    }
}