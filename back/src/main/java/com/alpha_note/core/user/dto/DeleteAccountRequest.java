package com.alpha_note.core.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeleteAccountRequest {
    @NotBlank(message = "비밀번호를 입력해주세요.")
    private String password;  // 본인 확인용 비밀번호

    private String reason;  // 탈퇴 사유 (선택사항)
}
