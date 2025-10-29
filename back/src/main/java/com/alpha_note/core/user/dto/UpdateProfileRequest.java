package com.alpha_note.core.user.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @Size(max = 20, message = "Nickname must be at most 20 characters")
    private String nickname;

    // 향후 추가될 필드들
    // private String bio;
    // private LocalDate birthDate;
    // 등등...
}
