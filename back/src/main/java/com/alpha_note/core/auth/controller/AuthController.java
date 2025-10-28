package com.alpha_note.core.auth.controller;

import com.alpha_note.core.auth.dto.AuthResponse;
import com.alpha_note.core.auth.dto.EmailCheckRequest;
import com.alpha_note.core.auth.dto.EmailCheckResponse;
import com.alpha_note.core.auth.dto.LoginRequest;
import com.alpha_note.core.auth.dto.RegisterRequest;
import com.alpha_note.core.auth.service.AuthService;
import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.user.dto.UserResponse;
import com.alpha_note.core.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

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
}
