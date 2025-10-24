package com.alpha_note.core.security.oauth2;

import com.alpha_note.core.security.jwt.JwtUtil;
import com.alpha_note.core.user.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * OAuth2 인증 성공 후 처리를 담당하는 핸들러
 */
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

        // User 정보로 JWT 토큰 생성
        String token = jwtUtil.generateToken(user);

        // UriComponentsBuilder를 사용하여 안전하게 URL 생성
        return UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)  // ?token=생성된JWT 추가
                .build().toUriString();
    }
}
