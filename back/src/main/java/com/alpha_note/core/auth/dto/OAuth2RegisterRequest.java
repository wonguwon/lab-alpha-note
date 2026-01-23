package com.alpha_note.core.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * OAuth2 회원가입 요청 DTO
 * - 임시 토큰과 추가 정보를 받아 회원가입 완료
 */
@Data
public class OAuth2RegisterRequest {
    @NotBlank(message = "임시 토큰이 필요합니다.")
    private String tempToken;

    @NotBlank(message = "닉네임을 입력해주세요.")
    @Size(max = 20, message = "닉네임은 최대 20자까지 입력 가능합니다.")
    private String nickname;

    private boolean emailSubscribed = false; // 이메일 이벤트 정보 수신 동의 여부
}

