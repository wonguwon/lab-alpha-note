package com.alpha_note.core.qna.dto.response;

import com.alpha_note.core.qna.entity.Answer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerResponse {

    private Long id;
    private Long questionId;
    private Long userId;
    private String userNickname; // Service에서 추가
    private String profileImageUrl; // Service에서 추가
    private String content;
    private Integer voteCount;
    private Boolean isAccepted;
    private Boolean isVotedByCurrentUser; // Service에서 추가
    private Instant createdAt;
    private Instant updatedAt;
    private List<CommentResponse> comments; // Optional, Service에서 추가

    public static AnswerResponse from(Answer answer) {
        return AnswerResponse.builder()
                .id(answer.getId())
                .questionId(answer.getQuestionId())
                .userId(answer.getUserId())
                .content(answer.getContent())
                .voteCount(answer.getVoteCount())
                .isAccepted(answer.getIsAccepted())
                .createdAt(answer.getCreatedAt())
                .updatedAt(answer.getUpdatedAt())
                .build();
    }
}
