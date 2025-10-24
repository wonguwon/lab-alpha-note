package com.alpha_note.core.auth.controller;

import com.alpha_note.core.auth.dto.EmailSendRequest;
import com.alpha_note.core.auth.dto.EmailSendResponse;
import com.alpha_note.core.auth.dto.EmailVerifyRequest;
import com.alpha_note.core.auth.dto.EmailVerifyResponse;
import com.alpha_note.core.auth.service.EmailVerificationService;
import com.alpha_note.core.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

/**
 * 이메일 인증 컨트롤러
 * - 인증 코드 전송
 * - 인증 코드 검증
 */
@RestController
@RequestMapping("/api/v1/auth/email")
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;

    /**
     * 인증 코드 이메일 전송
     */
    @PostMapping("/send")
    public ResponseEntity<ApiResponse<EmailSendResponse>> sendVerificationCode(
            @Valid @RequestBody EmailSendRequest request) {

        Instant expiresAt = emailVerificationService.sendVerificationCode(request.getEmail());

        EmailSendResponse response = EmailSendResponse.builder()
                .success(true)
                .expiresAt(expiresAt)
                .build();

        return ResponseEntity.ok(
                ApiResponse.success("인증 코드가 이메일로 전송되었습니다.", response)
        );
    }

    /**
     * 인증 코드 검증
     */
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<EmailVerifyResponse>> verifyCode(
            @Valid @RequestBody EmailVerifyRequest request) {

        boolean verified = emailVerificationService.verifyCode(request.getEmail(), request.getCode());

        EmailVerifyResponse response = EmailVerifyResponse.builder()
                .success(true)
                .verified(verified)
                .build();

        return ResponseEntity.ok(
                ApiResponse.success("이메일 인증이 완료되었습니다.", response)
        );
    }
}
