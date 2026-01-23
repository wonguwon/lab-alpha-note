package com.alpha_note.core.security.oauth2;

import com.alpha_note.core.auth.service.RefreshTokenService;
import com.alpha_note.core.security.jwt.JwtUtil;
import com.alpha_note.core.user.entity.User;
import jakarta.servlet.http.Cookie;
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
    private final RefreshTokenService refreshTokenService;

    // 인증 성공 후 리다이렉트할 프론트엔드 URL
    @Value("${app.oauth2.authorized-redirect-uri:http://localhost:3000/oauth2/redirect}")
    private String redirectUri;

    // JWT 만료 시간 (쿠키 설정용)
    @Value("${jwt.expiration:86400000}") // 24 hours
    private Long jwtExpiration;

    @Value("${jwt.refresh-expiration:604800000}") // 7 days
    private Long refreshExpiration;

    // 쿠키 Domain 설정 (프로덕션: alpha-note.co.kr, 개발: null)
    @Value("${app.cookie.domain:}")
    private String cookieDomain;

    // 쿠키 Secure 플래그 (프로덕션: true, 개발: false)
    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    // 쿠키 SameSite 정책 (프로덕션: None, 개발: Lax)
    @Value("${app.cookie.same-site:Lax}")
    private String cookieSameSite;

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
        
        // 리프레시 토큰 생성 및 저장
        var refreshToken = refreshTokenService.createRefreshToken(user);
        
        // HttpOnly 쿠키에 액세스 토큰 저장
        setAuthCookie(response, token);
        
        // HttpOnly 쿠키에 리프레시 토큰 저장
        setRefreshTokenCookie(response, refreshToken.getToken());
        
        log.info("Issued access token and refresh token for login: email={}", user.getEmail());
        
        // 쿠키가 설정되었으므로 URL에서 토큰 제거 (보안상 권장)
        return UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("success", "true")
                .build()
                .toUriString();
    }

    /**
     * HttpOnly 쿠키에 JWT 토큰 설정
     */
    private void setAuthCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("access_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/");
        cookie.setMaxAge((int) (jwtExpiration / 1000)); // 초 단위로 변환
        
        // Domain 설정 (값이 있으면 설정)
        if (cookieDomain != null && !cookieDomain.isEmpty()) {
            cookie.setDomain(cookieDomain);
        }
        
        // SameSite 설정
        cookie.setAttribute("SameSite", cookieSameSite);
        
        response.addCookie(cookie);
    }

    /**
     * HttpOnly 쿠키에 리프레시 토큰 설정
     */
    private void setRefreshTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("refresh_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/");
        cookie.setMaxAge((int) (refreshExpiration / 1000)); // 초 단위로 변환
        
        // Domain 설정 (값이 있으면 설정)
        if (cookieDomain != null && !cookieDomain.isEmpty()) {
            cookie.setDomain(cookieDomain);
        }
        
        // SameSite 설정
        cookie.setAttribute("SameSite", cookieSameSite);
        
        response.addCookie(cookie);
    }
}
