package com.alpha_note.core.auth.controller;

import com.alpha_note.core.auth.dto.AuthResponse;
import com.alpha_note.core.auth.dto.EmailCheckRequest;
import com.alpha_note.core.auth.dto.EmailCheckResponse;
import com.alpha_note.core.auth.dto.LoginRequest;
import com.alpha_note.core.auth.dto.RegisterRequest;
import com.alpha_note.core.auth.service.AuthService;
import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.security.jwt.JwtUtil;
import com.alpha_note.core.user.dto.UserResponse;
import com.alpha_note.core.user.entity.User;
import com.alpha_note.core.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

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
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("회원가입이 성공적으로 완료되었습니다.", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("로그인이 성공적으로 완료되었습니다.", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal User user) {
        UserResponse response = UserResponse.from(user);
        return ResponseEntity.ok(ApiResponse.success("사용자 정보를 성공적으로 조회했습니다.", response));
    }

    /**
     * 계정 복구 (60일 이내)
     * POST /api/v1/auth/recover
     * Header: Authorization: Bearer {recoveryToken}
     */
    @PostMapping("/recover")
    @Transactional
    public ResponseEntity<ApiResponse<AuthResponse>> recoverAccount(
            @RequestHeader("Authorization") String authHeader) {

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

        AuthResponse response = AuthResponse.builder()
                .token(accessToken)
                .nickname(recoveredUser.getNickname())
                .email(recoveredUser.getEmail())
                .role(recoveredUser.getRole().name())
                .build();

        return ResponseEntity.ok(ApiResponse.success("계정이 성공적으로 복구되었습니다.", response));
    }
}
