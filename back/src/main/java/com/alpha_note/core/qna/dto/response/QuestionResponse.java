package com.alpha_note.core.qna.dto.response;

import com.alpha_note.core.qna.entity.Question;
import com.alpha_note.core.qna.enums.QuestionCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jsoup.Jsoup;

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
    private String profileImageUrl; // Service에서 추가
    private String title;
    private String contentPreview; // 앞부분만 (최대 200자)
    private QuestionCategory category;
    private String categoryDisplayName;
    private Integer viewCount;
    private Integer voteCount;
    private Integer answerCount;
    private Boolean isAnswered;
    private Instant lastActivityAt;
    private Instant createdAt;
    private List<TagResponse> tags; // Service에서 추가

    public static QuestionResponse from(Question question) {
        // HTML 태그 제거하고 텍스트만 추출
        String preview = question.getContent();
        if (preview != null && !preview.isEmpty()) {
            // Jsoup을 사용해서 HTML 태그 제거 및 이미지 태그 제거
            preview = Jsoup.parse(preview).text();
            if (preview.length() > 200) {
                preview = preview.substring(0, 200) + "...";
            }
        }

        QuestionCategory category = question.getCategory() != null
                ? question.getCategory()
                : QuestionCategory.TECH;

        return QuestionResponse.builder()
                .id(question.getId())
                .userId(question.getUserId())
                .title(question.getTitle())
                .contentPreview(preview)
                .category(category)
                .categoryDisplayName(category.getDisplayName())
                .viewCount(question.getViewCount())
                .voteCount(question.getVoteCount())
                .answerCount(question.getAnswerCount())
                .isAnswered(question.getIsAnswered())
                .lastActivityAt(question.getLastActivityAt())
                .createdAt(question.getCreatedAt())
                .build();
    }
}
