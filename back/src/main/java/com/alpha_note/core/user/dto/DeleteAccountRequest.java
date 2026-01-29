package com.alpha_note.core.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeleteAccountRequest {
    private String password;  // 본인 확인용 비밀번호 (LOCAL 사용자만 필수)

    private String reason;  // 탈퇴 사유 (선택사항)
}
