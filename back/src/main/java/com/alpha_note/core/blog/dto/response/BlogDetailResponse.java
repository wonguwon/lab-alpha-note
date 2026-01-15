package com.alpha_note.core.blog.dto.response;

import com.alpha_note.core.blog.entity.Blog;
import com.alpha_note.core.qna.dto.response.TagResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

/**
 * 블로그 상세 조회용 응답 DTO (전체 정보 + 댓글 포함)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogDetailResponse {

    private Long id;
    private Long userId;
    private String userNickname; // Service에서 추가
    private String profileImageUrl; // Service에서 추가
    private String title;
    private String content; // 전체 내용
    private String thumbnailUrl;
    private Integer viewCount;
    private Integer voteCount;
    private Boolean isVotedByCurrentUser; // Service에서 추가
    private Instant lastActivityAt;
    private Instant createdAt;
    private Instant updatedAt;
    private List<TagResponse> tags; // Service에서 추가
    private Integer commentCount; // Service에서 추가


    public static BlogDetailResponse from(Blog blog) {
        return BlogDetailResponse.builder()
                .id(blog.getId())
                .userId(blog.getUserId())
                .title(blog.getTitle())
                .content(blog.getContent())
                .thumbnailUrl(blog.getThumbnailUrl())
                .viewCount(blog.getViewCount())
                .voteCount(blog.getVoteCount())
                .lastActivityAt(blog.getLastActivityAt())
                .createdAt(blog.getCreatedAt())
                .updatedAt(blog.getUpdatedAt())
                .build();
    }
}
