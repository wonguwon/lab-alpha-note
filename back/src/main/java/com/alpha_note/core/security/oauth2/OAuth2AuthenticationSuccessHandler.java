package com.alpha_note.core.security.oauth2;

import com.alpha_note.core.security.jwt.JwtUtil;
import com.alpha_note.core.user.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * OAuth2 인증 성공 후 처리를 담당하는 핸들러
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    // JWT 토큰을 생성하기 위한 유틸리티
    private final JwtUtil jwtUtil;

    // 인증 성공 후 리다이렉트할 프론트엔드 URL
    @Value("${app.oauth2.authorized-redirect-uri:http://localhost:3000/oauth2/redirect}")
    private String redirectUri;

    // OAuth2 인증 성공 시 호출되는 메인 메서드
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        // JWT 토큰이 포함된 최종 리다이렉트 URL 생성
        String targetUrl = determineTargetUrl(request, response, authentication);

        // 생성한 URL로 실제 리다이렉트 수행
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    // 리다이렉트할 최종 URL 생성
    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) {

        // AppUserPrincipal에서 User 엔티티 추출
        AppUserPrincipal principal = (AppUserPrincipal) authentication.getPrincipal();
        User user = principal.getUser();
        
        // OAuth2 클라이언트 등록 ID로 로그인/회원가입 구분
        // registrationId 추출: OAuth2AuthenticationToken에서 가져옴
        String registrationId = null;
        if (authentication instanceof org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken) {
            registrationId = ((org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken) authentication)
                    .getAuthorizedClientRegistrationId();
        }
        
        boolean isSignupMode = "google-signup".equals(registrationId);
        
        log.info("OAuth2 authentication success: registrationId={}, email={}, isNewUser={}", 
                registrationId, user.getEmail(), principal.isNewUser());
        
        // signup 모드에서 신규 사용자: 임시 토큰 발급
        if (isSignupMode && principal.isNewUser()) {
            String tempToken = jwtUtil.generateOAuth2TempToken(
                    user.getEmail(),
                    user.getProvider().name(),
                    user.getProviderId()
            );
            
            log.info("Issued temporary token for signup: email={}", user.getEmail());
            
            return UriComponentsBuilder.fromUriString(redirectUri)
                    .queryParam("tempToken", tempToken)
                    .queryParam("mode", "signup")
                    .build()
                    .toUriString();
        }
        
        // signup 모드에서 기존 사용자: 에러
        if (isSignupMode && !principal.isNewUser()) {
            log.warn("Signup attempt with existing user: email={}", user.getEmail());
            
            return UriComponentsBuilder.fromUriString(redirectUri)
                    .queryParam("errorCode", "A007")  // OAUTH2_SIGNUP_ALREADY_REGISTERED
                    .build()
                    .toUriString();
        }
        
        // login 모드에서 신규 사용자: 에러
        if (!isSignupMode && principal.isNewUser()) {
            log.warn("Login attempt with new user: email={}", user.getEmail());
            
            return UriComponentsBuilder.fromUriString(redirectUri)
                    .queryParam("errorCode", "A008")  // OAUTH2_LOGIN_NOT_REGISTERED
                    .build()
                    .toUriString();
        }
        
        // login 모드에서 기존 사용자: 정상 토큰 발급
        String token = jwtUtil.generateToken(user);
        
        log.info("Issued access token for login: email={}", user.getEmail());
        
        return UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .build()
                .toUriString();
    }
}
