package com.alpha_note.core.user.entity;

import java.util.Arrays;

/**
 * OAuth2 인증 제공자
 * - LOCAL: 일반 회원가입/로그인
 * - GOOGLE: Google OAuth2 로그인
 */
public enum AuthProvider {
    LOCAL("local"),
    GOOGLE("google");

    private final String registrationId;

    AuthProvider(String registrationId) {
        this.registrationId = registrationId;
    }

    public String getRegistrationId() {
        return registrationId;
    }

    /**
     * registrationId로부터 Provider 찾기
     * @param registrationId OAuth2 클라이언트 등록 ID (예: "google")
     * @return 매칭되는 AuthProvider
     * @throws IllegalArgumentException 지원하지 않는 Provider인 경우
     */
    public static AuthProvider fromRegistrationId(String registrationId) {
        return Arrays.stream(values())
                .filter(provider -> provider.registrationId.equalsIgnoreCase(registrationId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Login with " + registrationId + " is not supported."));
    }
}
