package com.alpha_note.core.qna.dto.response;

import com.alpha_note.core.qna.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

/**
 * 질문 상세 조회용 응답 DTO (전체 정보 + 답변/댓글 포함)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDetailResponse {

    private Long id;
    private Long userId;
    private String userNickname; // Service에서 추가
    private String title;
    private String content; // 전체 내용
    private Integer viewCount;
    private Integer voteCount;
    private Integer answerCount;
    private Boolean isAnswered;
    private Long acceptedAnswerId;
    private Boolean isVotedByCurrentUser; // Service에서 추가
    private Instant lastActivityAt;
    private Instant createdAt;
    private Instant updatedAt;
    private List<TagResponse> tags; // Service에서 추가
    private List<CommentResponse> comments; // Service에서 추가
    private List<AttachmentResponse> attachments; // Service에서 추가
    private List<AnswerResponse> answers; // Service에서 추가 (채택 답변 우선 정렬)

    public static QuestionDetailResponse from(Question question) {
        return QuestionDetailResponse.builder()
                .id(question.getId())
                .userId(question.getUserId())
                .title(question.getTitle())
                .content(question.getContent())
                .viewCount(question.getViewCount())
                .voteCount(question.getVoteCount())
                .answerCount(question.getAnswerCount())
                .isAnswered(question.getIsAnswered())
                .acceptedAnswerId(question.getAcceptedAnswerId())
                .lastActivityAt(question.getLastActivityAt())
                .createdAt(question.getCreatedAt())
                .updatedAt(question.getUpdatedAt())
                .build();
    }
}
