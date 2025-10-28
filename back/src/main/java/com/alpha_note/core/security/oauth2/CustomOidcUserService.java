package com.alpha_note.core.security.oauth2;

import com.alpha_note.core.user.entity.AuthProvider;
import com.alpha_note.core.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

/**
 * Google OAuth2(OIDC) 로그인 처리 서비스
 * - OidcUser를 로드하고 DB와 동기화
 * - AppUserPrincipal로 래핑하여 반환
 */
@Service
@RequiredArgsConstructor
public class CustomOidcUserService extends OidcUserService {

    private final OAuth2UserSynchronizer userSynchronizer;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        // Spring Security의 기본 OidcUserService로 사용자 정보 로드
        OidcUser oidcUser = super.loadUser(userRequest);

        try {
            return processOidcUser(userRequest, oidcUser);
        } catch (OAuth2AuthenticationException ex) {
            // OAuth2 인증 예외는 그대로 던져서 사용자에게 명확한 메시지 전달
            throw ex;
        } catch (Exception ex) {
            // 예상치 못한 시스템 오류만 Internal 예외로 변환
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    /**
     * OIDC 사용자 정보를 DB와 동기화하고 AppUserPrincipal로 래핑
     */
    private OidcUser processOidcUser(OidcUserRequest userRequest, OidcUser oidcUser) {
        // Provider 추출 (google)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        AuthProvider provider = AuthProvider.fromRegistrationId(registrationId);

        // 사용자 정보 동기화 (신규 등록 또는 업데이트)
        User user = userSynchronizer.synchronizeUser(provider, oidcUser.getAttributes());

        // AppUserPrincipal로 래핑하여 반환 (OIDC 생성자 사용)
        return new AppUserPrincipal(user, oidcUser);
    }
}
