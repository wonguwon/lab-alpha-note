package com.alpha_note.core.security.oauth2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
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

        String errorCode = "A009"; // 기본값: 일반 OAuth2 에러
        
        // OAuth2AuthenticationException인 경우 에러 코드 확인
        if (exception instanceof OAuth2AuthenticationException) {
            OAuth2AuthenticationException oauth2Exception = (OAuth2AuthenticationException) exception;
            OAuth2Error error = oauth2Exception.getError();
            
            // Provider 불일치 에러인 경우 A010으로 구분
            if ("provider_mismatch".equals(error.getErrorCode())) {
                errorCode = "A010";
            }
        }

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("errorCode", errorCode)
                .build()
                .encode()
                .toUriString();

        log.error("OAuth2 authentication failed: {} (errorCode: {}, exception: {})", 
                exception.getMessage(), errorCode, exception.getClass().getSimpleName());

        // 프론트엔드로 리다이렉트
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
