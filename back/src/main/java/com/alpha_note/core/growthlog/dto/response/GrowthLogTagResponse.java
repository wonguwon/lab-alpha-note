package com.alpha_note.core.growthlog.dto.response;

import com.alpha_note.core.common.response.BaseTagResponse;
import com.alpha_note.core.common.entity.Tag;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
public class GrowthLogTagResponse extends BaseTagResponse {
    public static GrowthLogTagResponse from(Tag tag) {
        return GrowthLogTagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .description(tag.getDescription())
                .useCount(tag.getUseCount())
                .createdAt(tag.getCreatedAt())
                .build();
    }
}
