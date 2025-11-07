package com.alpha_note.core.qna.dto.response;

import com.alpha_note.core.qna.entity.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagResponse {

    private Long id;
    private String name;
    private String description;
    private Integer useCount;
    private Instant createdAt;

    public static TagResponse from(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .description(tag.getDescription())
                .useCount(tag.getUseCount())
                .createdAt(tag.getCreatedAt())
                .build();
    }
}
