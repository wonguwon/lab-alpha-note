package com.alpha_note.core.blog.dto.response;

import com.alpha_note.core.blog.entity.BlogComment;
import com.alpha_note.core.common.response.BaseCommentResponse;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
public class BlogCommentResponse extends BaseCommentResponse {
    private String userNickname; // Service에서 추가
    private String profileImageUrl; // Service에서 추가


    public static BlogCommentResponse from(BlogComment comment) {
        return BlogCommentResponse.builder()
                .id(comment.getId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
