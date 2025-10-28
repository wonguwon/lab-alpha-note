package com.alpha_note.core.security.oauth2;

import com.alpha_note.core.user.entity.AuthProvider;
import com.alpha_note.core.user.entity.Role;
import com.alpha_note.core.user.entity.User;
import com.alpha_note.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Map;
import java.util.Optional;

/**
 * OAuth2/OIDC 로그인 시 사용자 정보를 동기화하는 컴포넌트
 * - Provider별 사용자 정보 추출
 * - 신규 사용자 등록 또는 기존 사용자 업데이트
 * - CustomOAuth2UserService와 CustomOidcUserService에서 공통으로 사용
 */
@Component
@RequiredArgsConstructor
public class OAuth2UserSynchronizer {

    private final UserRepository userRepository;

    /**
     * OAuth2 attributes로부터 사용자 정보를 추출하여 DB에 저장/업데이트
     *
     * @param provider OAuth2 제공자 (GOOGLE 등)
     * @param attributes OAuth2/OIDC에서 받은 사용자 정보
     * @return 저장/업데이트된 User 엔티티
     */
    public User synchronizeUser(AuthProvider provider, Map<String, Object> attributes) {
        // Provider별 어댑터로 사용자 정보 추출
        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(
                provider.name(),
                attributes
        );

        // 이메일 필수 체크
        if (!StringUtils.hasText(userInfo.getEmail())) {
            throw new OAuth2AuthenticationException("OAuth2 제공자로부터 이메일 정보를 받지 못했습니다.");
        }

        // 이메일로 기존 사용자 조회
        Optional<User> userOptional = userRepository.findByEmail(userInfo.getEmail());
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            // 다른 제공자로 이미 가입된 경우 에러
            if (!user.getProvider().equals(provider)) {
                String providerName = getProviderDisplayName(user.getProvider());
                throw new OAuth2AuthenticationException(
                        "이미 " + providerName + "로 가입된 계정입니다. " +
                        providerName + " 로그인을 사용해주세요."
                );
            }
            // 기존 사용자 정보 업데이트
            user = updateExistingUser(user, userInfo);
        } else {
            // 신규 사용자 등록
            user = registerNewUser(provider, userInfo);
        }

        return user;
    }

    /**
     * 신규 사용자 등록
     */
    private User registerNewUser(AuthProvider provider, OAuth2UserInfo userInfo) {
        User user = User.builder()
                .provider(provider)
                .providerId(userInfo.getId())
                .nickname(userInfo.getName())
                .email(userInfo.getEmail())
                .profileImageUrl(userInfo.getImageUrl())
                .emailSubscribed(false) // OAuth2 가입 시 기본값 false
                .role(Role.USER)
                .build();

        return userRepository.save(user);
    }

    /**
     * 기존 사용자 정보 업데이트 (이름, 프로필 이미지)
     */
    private User updateExistingUser(User existingUser, OAuth2UserInfo userInfo) {
        existingUser.updateOAuth2Info(userInfo.getName(), userInfo.getImageUrl());
        return userRepository.save(existingUser);
    }

    /**
     * Provider의 한국어 표시명 반환
     */
    private String getProviderDisplayName(AuthProvider provider) {
        return switch (provider) {
            case LOCAL -> "이메일";
            case GOOGLE -> "Google";
        };
    }
}
