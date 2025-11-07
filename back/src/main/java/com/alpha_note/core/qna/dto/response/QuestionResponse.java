package com.alpha_note.core.qna.dto.response;

import com.alpha_note.core.qna.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

/**
 * 질문 목록용 응답 DTO (간략한 정보)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {

    private Long id;
    private Long userId;
    private String userNickname; // Service에서 추가
    private String title;
    private String contentPreview; // 앞부분만 (최대 200자)
    private Integer viewCount;
    private Integer voteCount;
    private Integer answerCount;
    private Boolean isAnswered;
    private Instant lastActivityAt;
    private Instant createdAt;
    private List<TagResponse> tags; // Service에서 추가

    public static QuestionResponse from(Question question) {
        String preview = question.getContent();
        if (preview != null && preview.length() > 200) {
            preview = preview.substring(0, 200) + "...";
        }

        return QuestionResponse.builder()
                .id(question.getId())
                .userId(question.getUserId())
                .title(question.getTitle())
                .contentPreview(preview)
                .viewCount(question.getViewCount())
                .voteCount(question.getVoteCount())
                .answerCount(question.getAnswerCount())
                .isAnswered(question.getIsAnswered())
                .lastActivityAt(question.getLastActivityAt())
                .createdAt(question.getCreatedAt())
                .build();
    }
}
