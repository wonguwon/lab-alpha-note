package com.alpha_note.core.security.oauth2;

import com.alpha_note.core.storage.service.ImageProcessingService;
import com.alpha_note.core.user.entity.AuthProvider;
import com.alpha_note.core.user.entity.Role;
import com.alpha_note.core.user.entity.User;
import com.alpha_note.core.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

/**
 * OAuth2/OIDC 로그인 시 사용자 정보를 동기화하는 컴포넌트
 * - Provider별 사용자 정보 추출
 * - 신규 사용자 등록 또는 기존 사용자 업데이트
 * - CustomOAuth2UserService와 CustomOidcUserService에서 공통으로 사용
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2UserSynchronizer {

    private final UserRepository userRepository;
    private final ImageProcessingService imageProcessingService;
    private final Random random = new Random();
    private static final int MAX_NICKNAME_RETRY = 10;

    /**
     * User 동기화 결과
     */
    @Getter
    @AllArgsConstructor
    public static class UserSyncResult {
        private final User user;
        private final boolean isNewUser;
    }

    /**
     * OAuth2 attributes로부터 사용자 정보를 추출하여 DB 확인
     * 신규 사용자는 임시 User 객체만 생성 (DB에 저장하지 않음)
     *
     * @param provider OAuth2 제공자 (GOOGLE 등)
     * @param attributes OAuth2/OIDC에서 받은 사용자 정보
     * @return UserSyncResult (User 객체와 신규 여부 포함)
     */
    public UserSyncResult synchronizeUser(AuthProvider provider, Map<String, Object> attributes) {
        // Provider별 어댑터로 사용자 정보 추출
        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(
                provider.name(),
                attributes
        );

        // 이메일 필수 체크
        if (!StringUtils.hasText(userInfo.getEmail())) {
            OAuth2Error error = new OAuth2Error(
                    "email_not_provided",
                    "OAuth2 제공자로부터 이메일 정보를 받지 못했습니다.",
                    null
            );
            throw new OAuth2AuthenticationException(error);
        }

        // 모든 상태의 계정 조회 (탈퇴한 계정 포함하여 중복 가입 방지)
        Optional<User> userOptional = userRepository.findByEmail(userInfo.getEmail());
        User user;
        boolean isNewUser;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            isNewUser = false;
            
            // 1. 다른 제공자로 가입된 경우 에러 (A010 우선순위)
            if (!user.getProvider().equals(provider)) {
                String providerName = getProviderDisplayName(user.getProvider());
                String errorMessage = "이미 " + providerName + "로 가입된 계정입니다. " +
                        providerName + " 로그인을 사용해주세요.";
                OAuth2Error error = new OAuth2Error(
                        "provider_mismatch",
                        errorMessage,
                        null
                    );
                log.warn("OAuth2 provider mismatch: existing={}, requested={}, email={}",
                        user.getProvider(), provider, userInfo.getEmail());
                throw new OAuth2AuthenticationException(error, errorMessage);
            }

            // 2. 탈퇴 신청된 계정인 경우 에러 (복구 플로우 유도)
            if (user.isDeleted()) {
                log.warn("Deleted OAuth2 user login attempt: email={}, provider={}", user.getEmail(), provider);
                throw new OAuth2UserDeletedException(user, "탈퇴 신청된 계정입니다. 복구 후 이용 가능합니다.");
            }

            // profileImageUrl이 null인 경우에만 기본 이미지 설정
            if (user.getProfileImageUrl() == null || user.getProfileImageUrl().isEmpty()) {
                log.info("Setting default profile image for user: {}", user.getEmail());
                user.updateProfileImage(imageProcessingService.getDefaultProfileImageUrl());
                userRepository.save(user);
            }

            // 기존 사용자는 정보를 업데이트하지 않음 (최초 가입 시에만 설정됨)
            // 사용자가 앱 내에서 닉네임/프로필을 변경할 수 있도록 허용
            log.debug("Existing OAuth2 user logged in: email={}, nickname={}", user.getEmail(), user.getNickname());
        } else {
            // 신규 사용자: 임시 User 객체 생성 (DB에 저장하지 않음)
            user = createTempUser(provider, userInfo);
            isNewUser = true;
            log.info("New OAuth2 user detected: email={}, provider={}", userInfo.getEmail(), provider);
        }

        return new UserSyncResult(user, isNewUser);
    }
    
    /**
     * 임시 User 객체 생성 (신규 사용자용, DB 저장 안함)
     */
    private User createTempUser(AuthProvider provider, OAuth2UserInfo userInfo) {
        return User.builder()
                .provider(provider)
                .providerId(userInfo.getId())
                .email(userInfo.getEmail())
                .profileImageUrl(imageProcessingService.getDefaultProfileImageUrl())
                .emailSubscribed(false)
                .role(Role.USER)
                .build();
    }

    /**
     * 신규 사용자 등록 (2단계 저장)
     * 1단계: 기본 이미지로 User 저장 → userId 생성
     * 2단계: OAuth2 이미지 처리 → profileImageUrl 업데이트
     * 
     * @param provider OAuth2 제공자
     * @param providerId OAuth2 제공자의 사용자 ID
     * @param email 이메일
     * @param nickname 닉네임
     * @param emailSubscribed 마케팅 동의
     * @param profileImageUrl 프로필 이미지 URL
     * @return 저장된 User
     */
    public User registerNewUser(AuthProvider provider, String providerId, String email, 
                                String nickname, boolean emailSubscribed, String profileImageUrl) {
        // 1단계: 기본 프로필 이미지로 User 먼저 저장 (ID 생성 위해)
        User user = User.builder()
                .provider(provider)
                .providerId(providerId)
                .nickname(nickname)
                .email(email)
                .profileImageUrl(profileImageUrl != null ? profileImageUrl : imageProcessingService.getDefaultProfileImageUrl())
                .emailSubscribed(emailSubscribed)
                .role(Role.USER)
                .build();

        user = userRepository.save(user);
        log.info("User registered: userId={}, email={}, provider={}", user.getId(), email, provider);

        return user;
    }

    /**
     * 고유한 닉네임 생성
     * 1. 기본 이름으로 시도
     * 2. 중복 시 "이름#랜덤4자리" 형식으로 생성 (최대 10회 재시도)
     * 3. 10회 실패 시 UUID 기반 닉네임 생성
     *
     * @param baseName 기본 이름
     * @return 고유한 닉네임
     */
    public String generateUniqueNickname(String baseName) {
        // null이거나 빈 문자열인 경우 기본값 사용
        if (!StringUtils.hasText(baseName)) {
            baseName = "user";
        }

        // 1. 기본 이름으로 먼저 시도
        if (!userRepository.existsByNicknameAndIsDeletedFalse(baseName)) {
            log.info("Generated unique nickname: {}", baseName);
            return baseName;
        }

        // 2. "이름#랜덤4자리" 형식으로 재시도 (최대 10회)
        for (int i = 0; i < MAX_NICKNAME_RETRY; i++) {
            String randomSuffix = String.format("%04d", random.nextInt(10000));
            String candidateNickname = baseName + "#" + randomSuffix;

            if (!userRepository.existsByNicknameAndIsDeletedFalse(candidateNickname)) {
                log.info("Generated unique nickname with suffix: {}", candidateNickname);
                return candidateNickname;
            }
        }

        // 3. 10회 실패 시 UUID 기반으로 생성 (거의 발생하지 않음)
        String uuidSuffix = UUID.randomUUID().toString().substring(0, 8);
        String fallbackNickname = baseName + "_" + uuidSuffix;
        log.warn("Failed to generate nickname after {} retries, using UUID-based: {}",
                MAX_NICKNAME_RETRY, fallbackNickname);
        return fallbackNickname;
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
