package com.alpha_note.core.auth.controller;

import com.alpha_note.core.auth.dto.AuthResponse;
import com.alpha_note.core.auth.dto.EmailCheckRequest;
import com.alpha_note.core.auth.dto.EmailCheckResponse;
import com.alpha_note.core.auth.dto.LoginRequest;
import com.alpha_note.core.auth.dto.OAuth2RegisterRequest;
import com.alpha_note.core.auth.dto.PasswordResetConfirmRequest;
import com.alpha_note.core.auth.dto.PasswordResetRequest;
import com.alpha_note.core.auth.dto.RegisterRequest;
import com.alpha_note.core.auth.service.AuthService;
import com.alpha_note.core.auth.service.RefreshTokenService;
import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.security.jwt.JwtUtil;
import com.alpha_note.core.security.oauth2.OAuth2UserSynchronizer;
import com.alpha_note.core.user.dto.UserResponse;
import com.alpha_note.core.user.entity.AuthProvider;
import com.alpha_note.core.user.entity.User;
import com.alpha_note.core.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final OAuth2UserSynchronizer oauth2UserSynchronizer;
    private final RefreshTokenService refreshTokenService;

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

    @PostMapping("/email/check")
    public ResponseEntity<ApiResponse<EmailCheckResponse>> checkEmail(@Valid @RequestBody EmailCheckRequest request) {
        boolean available = authService.checkEmailAvailability(request.getEmail());

        EmailCheckResponse response = EmailCheckResponse.builder()
                .available(available)
                .message(available ? "사용 가능한 이메일입니다." : "이미 사용 중인 이메일입니다.")
                .build();

        return ResponseEntity.ok(ApiResponse.success("이메일 중복 검사가 완료되었습니다.", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse httpResponse) {
        var result = authService.register(request);
        AuthResponse response = result.getAuthResponse();
        
        // HttpOnly 쿠키에 액세스 토큰 저장
        setAuthCookie(httpResponse, response.getToken());
        
        // HttpOnly 쿠키에 리프레시 토큰 저장
        setRefreshTokenCookie(httpResponse, result.getRefreshToken());
        
        // 응답에서 토큰 제거 (보안상 권장)
        response.setToken(null);
        
        return ResponseEntity.ok(ApiResponse.success("회원가입이 성공적으로 완료되었습니다.", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse httpResponse) {
        var result = authService.login(request);
        AuthResponse response = result.getAuthResponse();
        
        // HttpOnly 쿠키에 액세스 토큰 저장
        setAuthCookie(httpResponse, response.getToken());
        
        // HttpOnly 쿠키에 리프레시 토큰 저장
        setRefreshTokenCookie(httpResponse, result.getRefreshToken());
        
        // 응답에서 토큰 제거 (보안상 권장)
        response.setToken(null);
        
        return ResponseEntity.ok(ApiResponse.success("로그인이 성공적으로 완료되었습니다.", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal User user) {
        UserResponse response = UserResponse.from(user);
        return ResponseEntity.ok(ApiResponse.success("사용자 정보를 성공적으로 조회했습니다.", response));
    }

    /**
     * 리프레시 토큰으로 새 액세스 토큰 발급
     * POST /api/v1/auth/refresh
     */
    @PostMapping("/refresh")
    @Transactional
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            HttpServletRequest request,
            HttpServletResponse httpResponse) {
        
        // 쿠키에서 리프레시 토큰 추출
        String refreshTokenValue = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refresh_token".equals(cookie.getName())) {
                    refreshTokenValue = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshTokenValue == null) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        // 리프레시 토큰으로 새 액세스 토큰 발급
        var result = authService.refreshToken(refreshTokenValue);
        AuthResponse response = result.getAuthResponse();
        String newRefreshToken = result.getRefreshToken();

        // HttpOnly 쿠키에 새 액세스 토큰 저장
        setAuthCookie(httpResponse, response.getToken());
        
        // HttpOnly 쿠키에 새 리프레시 토큰 저장
        setRefreshTokenCookie(httpResponse, newRefreshToken);
        
        // 응답에서 토큰 제거 (보안상 권장)
        response.setToken(null);
        
        return ResponseEntity.ok(ApiResponse.success("토큰이 성공적으로 갱신되었습니다.", response));
    }

    /**
     * 계정 복구 (60일 이내)
     * POST /api/v1/auth/recover
     * Header: Authorization: Bearer {recoveryToken}
     */
    @PostMapping("/recover")
    @Transactional
    public ResponseEntity<ApiResponse<AuthResponse>> recoverAccount(
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse httpResponse) {

        // Bearer 토큰 추출
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new CustomException(ErrorCode.INVALID_RECOVERY_TOKEN);
        }

        String recoveryToken = authHeader.substring(7);

        // 복구 토큰 검증
        if (!jwtUtil.validateRecoveryToken(recoveryToken)) {
            if (jwtUtil.isRecoveryToken(recoveryToken)) {
                throw new CustomException(ErrorCode.EXPIRED_RECOVERY_TOKEN);
            }
            throw new CustomException(ErrorCode.INVALID_RECOVERY_TOKEN);
        }

        // 토큰에서 userId 추출
        Long userId = jwtUtil.extractUserId(recoveryToken);
        if (userId == null) {
            throw new CustomException(ErrorCode.INVALID_RECOVERY_TOKEN);
        }

        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 복구 가능 여부 확인
        if (!user.canBeRecovered()) {
            throw new CustomException(ErrorCode.ACCOUNT_NOT_RECOVERABLE);
        }

        // 계정 복구
        user.recover();
        User recoveredUser = userRepository.save(user);

        // 정상 JWT 토큰 발급
        String accessToken = jwtUtil.generateToken(recoveredUser);

        // 리프레시 토큰 생성 및 저장
        var refreshToken = refreshTokenService.createRefreshToken(recoveredUser);

        AuthResponse response = AuthResponse.builder()
                .token(accessToken)
                .nickname(recoveredUser.getNickname())
                .email(recoveredUser.getEmail())
                .role(recoveredUser.getRole().name())
                .build();

        // HttpOnly 쿠키에 액세스 토큰 저장
        setAuthCookie(httpResponse, accessToken);
        
        // HttpOnly 쿠키에 리프레시 토큰 저장
        setRefreshTokenCookie(httpResponse, refreshToken.getToken());
        
        // 응답에서 토큰 제거 (보안상 권장)
        response.setToken(null);

        return ResponseEntity.ok(ApiResponse.success("계정이 성공적으로 복구되었습니다.", response));
    }

    /**
     * OAuth2 회원가입 완료
     * POST /api/v1/auth/oauth2/register
     * - 임시 토큰 검증 후 추가 정보 입력받아 회원가입 완료
     */
    @PostMapping("/oauth2/register")
    @Transactional
    public ResponseEntity<ApiResponse<AuthResponse>> oauth2Register(
            @Valid @RequestBody OAuth2RegisterRequest request,
            HttpServletResponse httpResponse) {
        log.info("OAuth2 register request received");

        // 임시 토큰 검증
        if (!jwtUtil.validateOAuth2TempToken(request.getTempToken())) {
            log.warn("Invalid or expired OAuth2 temp token");
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        // 임시 토큰에서 정보 추출
        String email = jwtUtil.extractOAuth2Email(request.getTempToken());
        String provider = jwtUtil.extractOAuth2Provider(request.getTempToken());
        String providerId = jwtUtil.extractOAuth2ProviderId(request.getTempToken());

        log.info("OAuth2 register: email={}, provider={}", email, provider);

        // 이메일 중복 체크 (다시 확인)
        if (userRepository.existsByEmailAndIsDeletedFalse(email)) {
            log.warn("Email already exists: {}", email);
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }

        // 닉네임 중복 체크
        if (userRepository.existsByNicknameAndIsDeletedFalse(request.getNickname())) {
            log.warn("Nickname already exists: {}", request.getNickname());
            throw new CustomException(ErrorCode.DUPLICATE_NICKNAME);
        }

        // 사용자 등록
        User user = oauth2UserSynchronizer.registerNewUser(
                AuthProvider.valueOf(provider),
                providerId,
                email,
                request.getNickname(),
                request.isEmailSubscribed(),
                null  // 프로필 이미지는 기본 이미지 사용
        );

        // 정식 JWT 토큰 발급
        String token = jwtUtil.generateToken(user);

        // 리프레시 토큰 생성 및 저장
        var refreshToken = refreshTokenService.createRefreshToken(user);

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .nickname(user.getNickname())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();

        // HttpOnly 쿠키에 토큰 저장
        setAuthCookie(httpResponse, token);
        
        // HttpOnly 쿠키에 리프레시 토큰 저장
        setRefreshTokenCookie(httpResponse, refreshToken.getToken());
        
        // 응답에서 토큰 제거 (보안상 권장)
        response.setToken(null);

        log.info("OAuth2 register completed: userId={}, email={}", user.getId(), email);

        return ResponseEntity.ok(ApiResponse.success("회원가입이 완료되었습니다.", response));
    }

    /**
     * 로그아웃
     * POST /api/v1/auth/logout
     */
    @PostMapping("/logout")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> logout(
            @AuthenticationPrincipal User user,
            HttpServletRequest request,
            HttpServletResponse httpResponse) {
        
        // 리프레시 토큰 무효화
        if (user != null) {
            authService.revokeAllUserRefreshTokens(user.getId());
        } else {
            // 인증되지 않은 경우에도 쿠키에서 리프레시 토큰 추출하여 무효화 시도
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("refresh_token".equals(cookie.getName())) {
                        authService.revokeRefreshToken(cookie.getValue());
                        break;
                    }
                }
            }
        }
        
        // 쿠키 삭제
        deleteAuthCookie(httpResponse);
        deleteRefreshTokenCookie(httpResponse);
        
        log.info("User logged out");
        
        return ResponseEntity.ok(ApiResponse.success("로그아웃이 성공적으로 완료되었습니다.", null));
    }

    /**
     * 비밀번호 찾기 요청 (재설정 링크 발송)
     * POST /api/v1/auth/password/reset/request
     */
    @PostMapping("/password/reset/request")
    public ResponseEntity<ApiResponse<Void>> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        log.info("Password reset request received {}",  request);
        authService.requestPasswordReset(request);
        return ResponseEntity.ok(ApiResponse.success("비밀번호 재설정 링크가 발송되었습니다.", null));
    }

    /**
     * 비밀번호 재설정
     * POST /api/v1/auth/password/reset/confirm
     */
    @PostMapping("/password/reset/confirm")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("비밀번호가 재설정되었습니다.", null));
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
     * 인증 쿠키 삭제
     */
    private void deleteAuthCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("access_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/");
        cookie.setMaxAge(0); // 즉시 만료
        
        // Domain 설정 (값이 있으면 설정)
        if (cookieDomain != null && !cookieDomain.isEmpty()) {
            cookie.setDomain(cookieDomain);
        }
        
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

    /**
     * 리프레시 토큰 쿠키 삭제
     */
    private void deleteRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("refresh_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/");
        cookie.setMaxAge(0); // 즉시 만료
        
        // Domain 설정 (값이 있으면 설정)
        if (cookieDomain != null && !cookieDomain.isEmpty()) {
            cookie.setDomain(cookieDomain);
        }
        
        response.addCookie(cookie);
    }
}
