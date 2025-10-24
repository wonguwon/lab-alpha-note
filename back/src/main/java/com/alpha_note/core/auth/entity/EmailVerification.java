package com.alpha_note.core.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 * 이메일 인증 엔티티
 * - 인증 코드 관리 및 검증
 * - 만료 시간, 시도 횟수 추적
 */
@Entity
@Table(
    name = "email_verifications",
    indexes = {
        @Index(name = "idx_email_verified", columnList = "email, verified"),
        @Index(name = "idx_expires_at", columnList = "expires_at")
    }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class EmailVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(nullable = false, length = 6)
    private String code;

    @Builder.Default
    @Column(nullable = false)
    private Boolean verified = false;

    @Builder.Default
    @Column(name = "attempt_count", nullable = false)
    private Integer attemptCount = 0;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    /**
     * 인증 시도 횟수 증가
     */
    public void incrementAttemptCount() {
        this.attemptCount++;
    }

    /**
     * 인증 완료 처리
     */
    public void markAsVerified() {
        this.verified = true;
    }

    /**
     * 만료 여부 확인
     */
    public boolean isExpired() {
        return Instant.now().isAfter(expiresAt);
    }

    /**
     * 최대 시도 횟수 초과 여부 (5회)
     */
    public boolean isAttemptsExceeded() {
        return attemptCount >= 5;
    }
}
