package com.alpha_note.core.security.oauth2;

import com.alpha_note.core.user.entity.AuthProvider;

import java.util.Map;

/**
 * OAuth2 제공자별 사용자 정보 객체를 생성하는 팩토리 클래스
 * 현재는 Google OAuth2만 지원
 */
public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        // Google OAuth2 로그인인 경우
        if (registrationId.equalsIgnoreCase(AuthProvider.GOOGLE.toString())) {
            return new GoogleOAuth2UserInfo(attributes);
        }

        // 지원하지 않는 OAuth2 제공자
        throw new IllegalArgumentException("Login with " + registrationId + " is not supported.");
    }
}
