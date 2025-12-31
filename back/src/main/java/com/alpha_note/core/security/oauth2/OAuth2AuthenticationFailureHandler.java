package com.alpha_note.core.security.oauth2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * OAuth2 인증 실패 후 처리를 담당하는 핸들러
 */
@Slf4j
@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Value("${app.oauth2.authorized-redirect-uri:http://localhost:3000/oauth2/redirect}")
    private String redirectUri;

    // OAuth2 인증 실패 시 호출되는 메서드
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {

        // OAuth2AuthenticationException에서 에러 메시지 추출
        String errorMessage = extractErrorMessage(exception);

        // 에러 메시지를 쿼리 파라미터로 포함한 리다이렉트 URL 생성
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("error", errorMessage)
                .build().toUriString();

        log.error("OAuth2 authentication failed: {} (errorMessage: {})", 
                exception.getMessage(), errorMessage);

        // 프론트엔드로 리다이렉트
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    /**
     * OAuth2AuthenticationException에서 사용자에게 표시할 에러 메시지 추출
     * 1순위: OAuth2Error의 description
     * 2순위: exception의 message
     * 3순위: 기본 메시지
     */
    private String extractErrorMessage(AuthenticationException exception) {
        // OAuth2AuthenticationException인 경우 OAuth2Error에서 추출
        if (exception instanceof org.springframework.security.oauth2.core.OAuth2AuthenticationException) {
            org.springframework.security.oauth2.core.OAuth2AuthenticationException oauth2Exception =
                    (org.springframework.security.oauth2.core.OAuth2AuthenticationException) exception;
            
            if (oauth2Exception.getError() != null && 
                oauth2Exception.getError().getDescription() != null) {
                return oauth2Exception.getError().getDescription();
            }
        }

        // exception의 message 확인
        if (exception.getMessage() != null && !exception.getMessage().isEmpty()) {
            return exception.getMessage();
        }

        // 기본 메시지
        return "OAuth2 로그인 중 오류가 발생했습니다. 다시 시도해주세요.";
    }
}
