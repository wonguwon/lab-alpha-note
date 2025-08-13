package com.alpha_note.core.common.constants;

public class SecurityConstants {
    
    // JWT 관련 상수
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String TOKEN_TYPE = "Bearer";
    
    // OAuth2 관련 상수
    public static final String OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME = "oauth2_auth_request";
    public static final String REDIRECT_URI_PARAM_COOKIE_NAME = "redirect_uri";
    public static final int COOKIE_EXPIRE_SECONDS = 180;
    
    // 기본 리다이렉트 URI
    public static final String DEFAULT_SUCCESS_URL = "/";
    public static final String DEFAULT_FAILURE_URL = "/login?error=true";
    
    private SecurityConstants() {
        // 유틸리티 클래스는 인스턴스화 방지
    }
}
