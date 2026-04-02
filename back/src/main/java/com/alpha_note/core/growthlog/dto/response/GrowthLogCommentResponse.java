package com.alpha_note.core.growthlog.dto.response;

import com.alpha_note.core.growthlog.entity.GrowthLogComment;
import com.alpha_note.core.common.response.BaseCommentResponse;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
public class GrowthLogCommentResponse extends BaseCommentResponse {
    private String userNickname; // Service에서 추가
    private String profileImageUrl; // Service에서 추가


    public static GrowthLogCommentResponse from(GrowthLogComment comment) {
        return GrowthLogCommentResponse.builder()
                .id(comment.getId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
