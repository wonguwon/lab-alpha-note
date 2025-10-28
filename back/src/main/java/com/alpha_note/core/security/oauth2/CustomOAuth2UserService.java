package com.alpha_note.core.security.oauth2;

import com.alpha_note.core.user.entity.AuthProvider;
import com.alpha_note.core.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

/**
 * 일반 OAuth2 로그인 처리 서비스 (카카오, GitHub 등)
 * - OAuth2User를 로드하고 DB와 동기화
 * - AppUserPrincipal로 래핑하여 반환
 */
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final OAuth2UserSynchronizer userSynchronizer;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        // Spring Security의 기본 DefaultOAuth2UserService로 사용자 정보 로드
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (OAuth2AuthenticationException ex) {
            // OAuth2 인증 예외는 그대로 던져서 사용자에게 명확한 메시지 전달
            throw ex;
        } catch (Exception ex) {
            // 예상치 못한 시스템 오류만 Internal 예외로 변환
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    /**
     * OAuth2 사용자 정보를 DB와 동기화하고 AppUserPrincipal로 래핑
     */
    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        // Provider 추출 (google, kakao, github 등)
        String registrationId = oAuth2UserRequest.getClientRegistration().getRegistrationId();
        AuthProvider provider = AuthProvider.fromRegistrationId(registrationId);

        // 사용자 정보 동기화 (신규 등록 또는 업데이트)
        User user = userSynchronizer.synchronizeUser(provider, oAuth2User.getAttributes());

        // AppUserPrincipal로 래핑하여 반환 (일반 OAuth2 생성자 사용)
        return new AppUserPrincipal(user, oAuth2User);
    }
}
