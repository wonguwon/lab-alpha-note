package com.alpha_note.core.config;

import com.alpha_note.core.security.filter.JwtAuthenticationFilter;
import com.alpha_note.core.security.oauth2.CustomOAuth2UserService;
import com.alpha_note.core.security.oauth2.CustomOidcUserService;
import com.alpha_note.core.security.oauth2.OAuth2AuthenticationFailureHandler;
import com.alpha_note.core.security.oauth2.OAuth2AuthenticationSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security 설정
 * - JWT 기반 인증 (일반 로그인)
 * - Google OAuth2 로그인
 * - REST API를 위한 Stateless 세션 정책
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Value("${app.cors.allowed-origins}")
    private List<String> allowedOrigins;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomOidcUserService customOidcUserService;
    private final UserDetailsService userDetailsService;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CORS 설정
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // REST API이므로 CSRF 비활성화
            .csrf(AbstractHttpConfigurer::disable)
            // HTTP Basic 인증 비활성화 (JWT 사용)
            .httpBasic(AbstractHttpConfigurer::disable)
            // REST API를 위한 Stateless 세션 정책 (세션 사용 안함)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            // 요청별 인증 규칙
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/v1/auth/register",     // 회원가입
                    "/api/v1/auth/login",        // 로그인
                    "/api/v1/auth/email/**",     // 이메일 인증 (send, verify)
                    "/api/v1/auth/recover",      // 계정 복구 (recoveryToken)
                    "/api/public/**",            // 공개 API
                    "/oauth2/**",                // OAuth2 관련 경로 (Google 로그인)
                    "/login/oauth2/**",          // 콜백
                    "/error"                     // 에러 페이지
                ).permitAll()
                .anyRequest().authenticated()  // 나머지는 인증 필요 (/api/v1/auth/me 포함)
            )
            // Google OAuth2 로그인 설정
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService)      // 일반 OAuth2 (카카오, GitHub 등)
                    .oidcUserService(customOidcUserService)     // OIDC (Google 등)
                )
                .successHandler(oAuth2AuthenticationSuccessHandler)
                .failureHandler(oAuth2AuthenticationFailureHandler)
            )
            // 일반 로그인을 위한 인증 제공자
            .authenticationProvider(authenticationProvider())
            // JWT 검증 필터 추가 (UsernamePasswordAuthenticationFilter 전에 실행)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 설정 파일에서 허용할 origin 가져오기
        configuration.setAllowedOrigins(allowedOrigins);
        
        // 모든 HTTP 메서드 허용
        configuration.setAllowedMethods(Arrays.asList("*"));
        
        // 모든 헤더 허용
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // 자격 증명 허용 (JWT 토큰 등)
        configuration.setAllowCredentials(true);
        
        // 모든 경로에 CORS 설정 적용
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    // 비밀번호 암호화를 위한 인코더
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 일반 로그인을 위한 인증 제공자
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // 인증 관리자 (일반 로그인 시 사용)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
