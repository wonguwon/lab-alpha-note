package com.alpha_note.core.growthlog.dto.response;

import com.alpha_note.core.growthlog.entity.GrowthLog;
import com.alpha_note.core.growthlog.enums.GrowthLogStatus;
import com.alpha_note.core.growthlog.enums.GrowthLogVisibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

/**
 * 성장기록 상세 조회용 응답 DTO (전체 정보 + 댓글 포함)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GrowthLogDetailResponse {

    private Long id;
    private Long userId;
    private String userNickname; // Service에서 추가
    private String profileImageUrl; // Service에서 추가
    private String title;
    private String content; // 전체 내용
    private String thumbnailUrl;
    private GrowthLogStatus status;
    private GrowthLogVisibility visibility;
    private Integer viewCount;
    private Integer voteCount;
    private Boolean isVotedByCurrentUser; // Service에서 추가
    private Instant lastActivityAt;
    private Instant createdAt;
    private Instant updatedAt;
    private List<GrowthLogTagResponse> tags; // Service에서 추가
    private Integer commentCount; // Service에서 추가


    public static GrowthLogDetailResponse from(GrowthLog growthLog) {
        return GrowthLogDetailResponse.builder()
                .id(growthLog.getId())
                .userId(growthLog.getUserId())
                .title(growthLog.getTitle())
                .content(growthLog.getContent())
                .thumbnailUrl(growthLog.getThumbnailUrl())
                .status(growthLog.getStatus())
                .visibility(growthLog.getVisibility())
                .viewCount(growthLog.getViewCount())
                .voteCount(growthLog.getVoteCount())
                .lastActivityAt(growthLog.getLastActivityAt())
                .createdAt(growthLog.getCreatedAt())
                .updatedAt(growthLog.getUpdatedAt())
                .build();
    }
}
