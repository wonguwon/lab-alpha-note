package com.alpha_note.core.user.dto;

import com.alpha_note.core.user.entity.AuthProvider;
import com.alpha_note.core.user.entity.Role;
import com.alpha_note.core.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * 사용자 정보 응답 DTO
 * - 민감 정보(password, providerId) 제외
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String nickname;
    private String email;
    private Role role;
    private AuthProvider provider;
    private String profileImageUrl;
    private boolean emailSubscribed;
    private Instant createdAt;
    private Instant updatedAt;

    /**
     * User 엔티티로부터 UserResponse 생성
     */
    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .role(user.getRole())
                .provider(user.getProvider())
                .profileImageUrl(user.getProfileImageUrl())
                .emailSubscribed(user.isEmailSubscribed())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
