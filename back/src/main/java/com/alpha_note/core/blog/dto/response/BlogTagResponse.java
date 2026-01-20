package com.alpha_note.core.blog.dto.response;

import com.alpha_note.core.common.response.BaseTagResponse;
import com.alpha_note.core.common.entity.Tag;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
public class BlogTagResponse extends BaseTagResponse {
    public static BlogTagResponse from(Tag tag) {
        return BlogTagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .description(tag.getDescription())
                .useCount(tag.getUseCount())
                .createdAt(tag.getCreatedAt())
                .build();
    }
}
