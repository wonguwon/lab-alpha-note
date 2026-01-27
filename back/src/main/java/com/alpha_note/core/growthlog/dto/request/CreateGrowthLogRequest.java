package com.alpha_note.core.growthlog.dto.request;

import com.alpha_note.core.growthlog.enums.GrowthLogStatus;
import com.alpha_note.core.growthlog.enums.GrowthLogVisibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CreateGrowthLogRequest {

    @NotBlank(message = "성장기록 제목은 필수입니다.")
    @Size(max = 255, message = "제목은 최대 255자까지 입력 가능합니다.")
    private String title;

    @NotBlank(message = "성장기록 내용은 필수입니다.")
    private String content;

    private String thumbnailUrl;

    @Size(max = 5, message = "태그는 최대 5개까지 추가할 수 있습니다.")
    private List<String> tags;

    private GrowthLogStatus status; // null이면 PUBLISHED

    private GrowthLogVisibility visibility; // null이면 PUBLIC

}
