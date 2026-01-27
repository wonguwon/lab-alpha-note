package com.alpha_note.core.growthlog.dto.request;

import com.alpha_note.core.growthlog.enums.GrowthLogVisibility;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChangeVisibilityRequest {

    @NotNull(message = "공개 범위는 필수입니다.")
    private GrowthLogVisibility visibility;
}
