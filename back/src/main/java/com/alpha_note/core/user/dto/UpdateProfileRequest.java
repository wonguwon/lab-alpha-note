package com.alpha_note.core.user.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @Size(max = 20, message = "닉네임은 최대 20자까지 입력 가능합니다.")
    private String nickname;

    // 향후 추가될 필드들
    // private String bio;
    // private LocalDate birthDate;
    // 등등...
}
