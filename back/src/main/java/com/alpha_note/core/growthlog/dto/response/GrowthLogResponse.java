package com.alpha_note.core.growthlog.dto.response;

import com.alpha_note.core.growthlog.entity.GrowthLog;
import com.alpha_note.core.growthlog.enums.GrowthLogStatus;
import com.alpha_note.core.growthlog.enums.GrowthLogVisibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jsoup.Jsoup;

import java.time.Instant;
import java.util.List;

/**
 * 성장기록 목록용 응답 DTO (간략한 정보)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GrowthLogResponse {

    private Long id;
    private Long userId;
    private String userNickname; // Service에서 추가
    private String title;
    private String contentPreview; // 앞부분만 (최대 200자)
    private String thumbnailUrl;
    private GrowthLogStatus status;
    private GrowthLogVisibility visibility;
    private Integer viewCount;
    private Integer voteCount;
    private Integer commentCount;
    private Instant lastActivityAt;
    private Instant createdAt;
    private List<GrowthLogTagResponse> tags; // Service에서 추가

    public static GrowthLogResponse from(GrowthLog growthLog) {
        // HTML 태그 제거하고 텍스트만 추출
        String preview = growthLog.getContent();
        if (preview != null && !preview.isEmpty()) {
            // Jsoup을 사용해서 HTML 태그 제거 및 이미지 태그 제거
            preview = Jsoup.parse(preview).text();
            if (preview.length() > 200) {
                preview = preview.substring(0, 200) + "...";
            }
        }

        return GrowthLogResponse.builder()
                .id(growthLog.getId())
                .userId(growthLog.getUserId())
                .title(growthLog.getTitle())
                .contentPreview(preview)
                .thumbnailUrl(growthLog.getThumbnailUrl())
                .status(growthLog.getStatus())
                .visibility(growthLog.getVisibility())
                .viewCount(growthLog.getViewCount())
                .voteCount(growthLog.getVoteCount())
                .commentCount(growthLog.getComments().size())
                .lastActivityAt(growthLog.getLastActivityAt())
                .createdAt(growthLog.getCreatedAt())
                .build();
    }
}
