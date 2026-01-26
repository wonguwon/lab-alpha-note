package com.alpha_note.core.blog.dto.request;

import com.alpha_note.core.blog.enums.BlogVisibility;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChangeVisibilityRequest {

    @NotNull(message = "공개 범위는 필수입니다.")
    private BlogVisibility visibility;
}
