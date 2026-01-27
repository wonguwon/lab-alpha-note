package com.alpha_note.core.growthlog.service;

import com.alpha_note.core.growthlog.dto.request.CreateGrowthLogCommentRequest;
import com.alpha_note.core.growthlog.dto.response.GrowthLogCommentResponse;
import com.alpha_note.core.growthlog.entity.GrowthLogComment;
import com.alpha_note.core.growthlog.repository.GrowthLogCommentRepository;
import com.alpha_note.core.growthlog.repository.GrowthLogRepository;
import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GrowthLogCommentService {

    private final GrowthLogRepository growthLogRepository;
    private final UserRepository userRepository;
    private final GrowthLogCommentRepository growthLogCommentRepository;

    /**
     * 성장기록 댓글 작성
     */
    @Transactional
    public GrowthLogCommentResponse createGrowthLogComment(Long growthLogId, Long userId, CreateGrowthLogCommentRequest request) {
        // 성장기록 존재 확인
        if (!growthLogRepository.existsById(growthLogId)) {
            throw new CustomException(ErrorCode.GROWTH_LOG_NOT_FOUND);
        }

        // 사용자 검증
        if (!userRepository.existsById(userId)) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        // 댓글 생성
        GrowthLogComment comment = GrowthLogComment.builder()
                .growthLogId(growthLogId)
                .userId(userId)
                .content(request.getContent())
                .build();

        GrowthLogComment savedComment = growthLogCommentRepository.save(comment);

        // 성장기록의 마지막 활동 시간 업데이트
        growthLogRepository.findById(growthLogId).ifPresent(growthLog -> {
            growthLog.updateLastActivity();
            growthLogRepository.save(growthLog);
        });

        log.info("성장기록 댓글 작성 완료 - commentId: {}, growthLogId: {}, userId: {}", savedComment.getId(), growthLogId, userId);

        return buildGrowthLogCommentResponse(savedComment);
    }

    /**
     * 성장기록 댓글 목록 조회
     */
    @Transactional(readOnly = true)
    public List<GrowthLogCommentResponse> getGrowthLogComments(Long growthLogId) {
        if (!growthLogRepository.existsById(growthLogId)) {
            throw new CustomException(ErrorCode.GROWTH_LOG_NOT_FOUND);
        }

        List<GrowthLogComment> comments = growthLogCommentRepository.findByGrowthLogIdAndIsDeletedFalseOrderByCreatedAtDesc(growthLogId);
        return comments.stream()
                .map(this::buildGrowthLogCommentResponse)
                .collect(Collectors.toList());
    }

    // ========== Private Helper 메소드 ==========

    /**
     * GrowthLogComment -> GrowthLogCommentResponse 변환
     */
    private GrowthLogCommentResponse buildGrowthLogCommentResponse(GrowthLogComment comment) {
        GrowthLogCommentResponse response = GrowthLogCommentResponse.from(comment);

        // 작성자 닉네임 및 프로필 이미지
        userRepository.findById(comment.getUserId()).ifPresent(user -> {
            response.setUserNickname(user.getNickname());
            response.setProfileImageUrl(user.getProfileImageUrl());
        });

        return response;
    }
}
