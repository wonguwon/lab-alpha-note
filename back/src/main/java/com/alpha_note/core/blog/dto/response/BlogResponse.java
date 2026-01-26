package com.alpha_note.core.blog.dto.response;

import com.alpha_note.core.blog.entity.Blog;
import com.alpha_note.core.blog.enums.BlogStatus;
import com.alpha_note.core.blog.enums.BlogVisibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jsoup.Jsoup;

import java.time.Instant;
import java.util.List;

/**
 * 블로그 목록용 응답 DTO (간략한 정보)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogResponse {

    private Long id;
    private Long userId;
    private String userNickname; // Service에서 추가
    private String title;
    private String contentPreview; // 앞부분만 (최대 200자)
    private String thumbnailUrl;
    private BlogStatus status;
    private BlogVisibility visibility;
    private Integer viewCount;
    private Integer voteCount;
    private Integer commentCount;
    private Instant lastActivityAt;
    private Instant createdAt;
    private List<BlogTagResponse> tags; // Service에서 추가

    public static BlogResponse from(Blog blog) {
        // HTML 태그 제거하고 텍스트만 추출
        String preview = blog.getContent();
        if (preview != null && !preview.isEmpty()) {
            // Jsoup을 사용해서 HTML 태그 제거 및 이미지 태그 제거
            preview = Jsoup.parse(preview).text();
            if (preview.length() > 200) {
                preview = preview.substring(0, 200) + "...";
            }
        }

        return BlogResponse.builder()
                .id(blog.getId())
                .userId(blog.getId())
                .title(blog.getTitle())
                .contentPreview(preview)
                .thumbnailUrl(blog.getThumbnailUrl())
                .status(blog.getStatus())
                .visibility(blog.getVisibility())
                .viewCount(blog.getViewCount())
                .voteCount(blog.getVoteCount())
                .commentCount(blog.getComments().size())
                .lastActivityAt(blog.getLastActivityAt())
                .createdAt(blog.getCreatedAt())
                .build();
    }
}
