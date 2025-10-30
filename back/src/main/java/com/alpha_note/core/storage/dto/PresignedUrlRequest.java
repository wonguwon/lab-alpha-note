package com.alpha_note.core.storage.dto;

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
public class PresignedUrlRequest {

    @NotBlank(message = "파일명은 필수입니다.")
    private String fileName;

    @NotBlank(message = "콘텐츠 타입은 필수입니다.")
    @Pattern(
        regexp = "^(image/png|image/jpeg|image/webp|application/pdf)$",
        message = "허용되지 않은 파일 형식입니다. (png, jpeg, webp, pdf만 가능)"
    )
    private String contentType;

    @NotBlank(message = "파일 경로는 필수입니다.")
    @Pattern(
        regexp = "^[^/].*$",
        message = "파일 경로는 슬래시(/)로 시작할 수 없습니다."
    )
    private String filePath;
}
