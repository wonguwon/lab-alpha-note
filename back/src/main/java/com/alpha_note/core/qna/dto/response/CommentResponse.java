package com.alpha_note.core.qna.dto.response;

import com.alpha_note.core.blog.entity.BlogComment;
import com.alpha_note.core.qna.entity.AnswerComment;
import com.alpha_note.core.qna.entity.QuestionComment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {

    private Long id;
    private Long userId;
    private String userNickname; // Service에서 추가
    private String profileImageUrl; // Service에서 추가
    private String content;
    private Instant createdAt;
    private Instant updatedAt;

    public static CommentResponse from(QuestionComment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

    public static CommentResponse from(AnswerComment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
