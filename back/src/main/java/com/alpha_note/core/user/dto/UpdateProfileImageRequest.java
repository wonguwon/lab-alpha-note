package com.alpha_note.core.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileImageRequest {

    @NotBlank(message = "프로필 이미지 URL은 필수입니다.")
    @Pattern(
        regexp = "^https://.*",
        message = "프로필 이미지 URL은 HTTPS로 시작해야 합니다."
    )
    private String profileImageUrl;
}
