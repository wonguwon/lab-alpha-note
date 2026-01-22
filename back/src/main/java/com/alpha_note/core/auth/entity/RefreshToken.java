package com.alpha_note.core.auth.entity;

import com.alpha_note.core.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 * 리프레시 토큰 엔티티
 * 사용자 인증을 위한 리프레시 토큰을 저장
 */
@Entity
@Table(name = "refresh_tokens", indexes = {
    @Index(name = "idx_token", columnList = "token"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_expires_at", columnList = "expires_at")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true, length = 500)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "last_used_at")
    private Instant lastUsedAt;

    @Builder.Default
    @Column(name = "is_revoked", nullable = false)
    private Boolean isRevoked = false;

    /**
     * 토큰이 만료되었는지 확인
     */
    public boolean isExpired() {
        return expiresAt.isBefore(Instant.now());
    }

    /**
     * 토큰이 유효한지 확인 (만료되지 않았고 무효화되지 않음)
     */
    public boolean isValid() {
        return !isRevoked && !isExpired();
    }

    /**
     * 토큰 사용 시 lastUsedAt 업데이트
     */
    public void markAsUsed() {
        this.lastUsedAt = Instant.now();
    }

    /**
     * 토큰 무효화
     */
    public void revoke() {
        this.isRevoked = true;
    }
}




