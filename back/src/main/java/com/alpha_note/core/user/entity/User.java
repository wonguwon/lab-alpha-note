package com.alpha_note.core.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

/**
 * 사용자 엔티티
 * - 일반 로그인: UserDetails 구현
 * - OAuth2 로그인: AppUserPrincipal에서 래핑하여 사용
 */
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String nickname;

    @Column(unique = true, nullable = false)
    private String email;

    @Column
    private String password; // OAuth2 사용자는 비밀번호가 없을 수 있음

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider provider;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Builder.Default
    @Column(name = "email_subscribed", nullable = false)
    private boolean emailSubscribed = false; // 이메일 이벤트 정보 수신 동의

    // 계정 상태 관리 필드
    @Builder.Default
    @Column(name = "account_locked", nullable = false)
    private boolean accountLocked = false;  // 계정 잠김 여부 (관리자가 정지)

    @Column(name = "password_expired_at")
    private Instant passwordExpiredAt;  // 비밀번호 만료일 (null이면 만료 없음)

    @Column(name = "last_password_reset_at")
    private Instant lastPasswordResetAt;  // 마지막 비밀번호 재설정 시간 (토큰 일회용 처리용)

    // 회원 탈퇴 관리 필드 (Soft Delete)
    @Builder.Default
    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;  // 탈퇴 신청 여부

    @Column(name = "deleted_at")
    private Instant deletedAt;  // 탈퇴 신청 시간

    @Column(name = "deletion_scheduled_at")
    private Instant deletionScheduledAt;  // 완전 삭제 예정일 (탈퇴 신청 + 60일)

    @Column(name = "deletion_reason", length = 500)
    private String deletionReason;  // 탈퇴 사유

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;  // UTC 기준 생성 시간 (Hibernate가 자동 설정)

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;  // UTC 기준 수정 시간 (Hibernate가 자동 갱신)
    
    // UserDetails 구현
    @Override
    public String getUsername() {
        // Spring Security에서 사용하는 username은 email을 반환
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        // 계정 만료 기능은 현재 사용하지 않음
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // accountLocked가 false여야 정상 (잠기지 않음)
        return !accountLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // passwordExpiredAt이 null이면 만료 없음
        // null이 아니면 현재 시간이 만료일 이전인지 확인
        if (passwordExpiredAt == null) {
            return true;
        }
        return Instant.now().isBefore(passwordExpiredAt);
    }

    @Override
    public boolean isEnabled() {
        // 계정 활성화 기능은 사용하지 않음 (항상 활성화)
        return true;
    }

    // OAuth2 로그인 시 사용자 정보 업데이트
    public void updateOAuth2Info(String nickname, String profileImageUrl) {
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
    }

    // 프로필 업데이트 메서드
    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updatePassword(String encodedPassword) {
        this.password = encodedPassword;
        this.lastPasswordResetAt = Instant.now();
    }

    public void updateProfileImage(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public void deleteProfileImage() {
        this.profileImageUrl = null;
    }

    // 계정 상태 관리 메서드
    public void lockAccount() {
        this.accountLocked = true;
    }

    public void unlockAccount() {
        this.accountLocked = false;
    }

    public void setPasswordExpiryDate(Instant expiryDate) {
        this.passwordExpiredAt = expiryDate;
    }

    // 비밀번호 만료일을 N일 후로 설정
    public void setPasswordExpiryDays(int days) {
        this.passwordExpiredAt = Instant.now().plus(days, java.time.temporal.ChronoUnit.DAYS);
    }

    // 회원 탈퇴 관리 메서드
    public void markForDeletion(int retentionDays, String reason) {
        this.isDeleted = true;
        this.deletedAt = Instant.now();
        this.deletionScheduledAt = Instant.now().plus(retentionDays, java.time.temporal.ChronoUnit.DAYS);
        this.deletionReason = reason;
        this.accountLocked = true;  // 탈퇴 신청 후 계정 잠금
    }

    public boolean canBeRecovered() {
        return isDeleted && deletionScheduledAt != null && Instant.now().isBefore(deletionScheduledAt);
    }

    public void recover() {
        this.isDeleted = false;
        this.deletedAt = null;
        this.deletionScheduledAt = null;
        this.deletionReason = null;
        this.accountLocked = false;
    }

    public boolean isPermanentDeletionDue() {
        return isDeleted && deletionScheduledAt != null && Instant.now().isAfter(deletionScheduledAt);
    }
}
