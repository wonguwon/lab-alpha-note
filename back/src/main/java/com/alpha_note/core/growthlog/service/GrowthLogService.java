package com.alpha_note.core.growthlog.service;

import com.alpha_note.core.growthlog.dto.response.GrowthLogTagResponse;
import com.alpha_note.core.growthlog.enums.GrowthLogSearchType;
import com.alpha_note.core.growthlog.enums.GrowthLogStatus;
import com.alpha_note.core.growthlog.enums.GrowthLogVisibility;
import com.alpha_note.core.growthlog.dto.request.CreateGrowthLogRequest;
import com.alpha_note.core.growthlog.dto.request.UpdateGrowthLogRequest;
import com.alpha_note.core.growthlog.dto.response.GrowthLogDetailResponse;
import com.alpha_note.core.growthlog.dto.response.GrowthLogResponse;
import com.alpha_note.core.growthlog.entity.GrowthLog;
import com.alpha_note.core.growthlog.entity.GrowthLogComment;
import com.alpha_note.core.growthlog.entity.GrowthLogTag;
import com.alpha_note.core.growthlog.repository.GrowthLogCommentRepository;
import com.alpha_note.core.growthlog.repository.GrowthLogRepository;
import com.alpha_note.core.growthlog.repository.GrowthLogTagRepository;
import com.alpha_note.core.growthlog.repository.GrowthLogVoteRepository;
import com.alpha_note.core.common.entity.Tag;
import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.common.repository.TagRepository;
import com.alpha_note.core.user.entity.User;
import com.alpha_note.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GrowthLogService {

    private final GrowthLogRepository growthLogRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final GrowthLogTagRepository growthLogTagRepository;
    private final GrowthLogVoteRepository growthLogVoteRepository;
    private final GrowthLogCommentRepository growthLogCommentRepository;
    private final GrowthLogViewCountService viewCountService;

    /**
     * 성장기록 목록 조회 (페이징) - 공개 + 발행 성장기록만 조회
     */
    @Transactional(readOnly = true)
    public Page<GrowthLogResponse> getGrowthLogs(Pageable pageable, Long currentUserId) {
        Page<GrowthLog> growthLogs = growthLogRepository.findAllPublicPublished(pageable);
        return growthLogs.map(q -> buildGrowthLogResponse(q, currentUserId));
    }

    /**
     * 성장기록 목록 조회 (페이징, 피드만)
     */
    @Transactional(readOnly = true)
    public Page<GrowthLogResponse> getFeedGrowthLogs(Pageable pageable, Long currentUserId) {
        Page<GrowthLog> growthLogs = growthLogRepository.findAllWithVotesByUserId(currentUserId, pageable);
        return growthLogs.map(q -> buildGrowthLogResponse(q, currentUserId));
    }

    /**
     * 성장기록 생성
     */
    @Transactional
    public GrowthLogDetailResponse createGrowthLog(Long userId, CreateGrowthLogRequest request) {
        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 성장기록 생성
        GrowthLog growthLog = GrowthLog.builder()
                .user(user)
                .title(request.getTitle())
                .content(request.getContent())
                .thumbnailUrl(request.getThumbnailUrl())
                .status(request.getStatus() != null ? request.getStatus() : GrowthLogStatus.PUBLISHED)
                .visibility(request.getVisibility() != null ? request.getVisibility() : GrowthLogVisibility.PUBLIC)
                .build();

        GrowthLog savedGrowthLog = growthLogRepository.save(growthLog);
        log.info("성장기록 생성 완료 - growthLogId: {}, userId: {}", savedGrowthLog.getId(), userId);

        // 태그 처리
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            if (request.getTags().size() > 5) {
                throw new CustomException(ErrorCode.MAX_TAGS_EXCEEDED);
            }
            attachTagsToGrowthLog(savedGrowthLog.getId(), request.getTags());
        }

        return getGrowthLogDetail(savedGrowthLog.getId(), userId);
    }

    /**
     * 성장기록 상세 조회 (조회수 증가 - 중복 방지)
     */
    @Transactional
    public GrowthLogDetailResponse getGrowthLogDetail(Long growthLogId, Long currentUserId) {
        GrowthLog growthLog = growthLogRepository.findByIdAndIsDeletedFalse(growthLogId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROWTH_LOG_NOT_FOUND));

        // 접근 권한 검증: 본인 성장기록이 아니면 공개+발행 상태만 접근 가능
        validateGrowthLogAccess(growthLog, currentUserId);

        // 조회수 증가 (로그인 사용자만, 중복 방지)
        if (currentUserId != null && !viewCountService.hasViewed(growthLogId, currentUserId)) {
            growthLog.incrementViewCount();
            viewCountService.recordView(growthLogId, currentUserId);
            growthLogRepository.save(growthLog);
            log.debug("성장기록 조회수 증가 - growthLogId: {}, userId: {}", growthLogId, currentUserId);
        }

        return buildGrowthLogDetailResponse(growthLog, currentUserId);
    }

    /**
     * 성장기록 삭제 (Soft Delete)
     */
    @Transactional
    public void deleteGrowthLog(Long growthLogId, Long userId) {
        GrowthLog growthLog = growthLogRepository.findByIdAndIsDeletedFalse(growthLogId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROWTH_LOG_NOT_FOUND));

        // 작성자 확인
        if (!growthLog.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.GROWTH_LOG_ACCESS_DENIED);
        }

        // Soft Delete
        growthLog.markAsDeleted();
        growthLogRepository.save(growthLog);

        // 연관 엔티티도 Soft Delete (Service에서 처리)
        softDeleteRelatedEntities(growthLogId);

        log.info("성장기록 삭제 완료 - growthLogId: {}", growthLogId);
    }

    /**
     * 성장기록 수정
     */
    @Transactional
    public GrowthLogDetailResponse updateGrowthLog(Long growthLogId, Long userId, UpdateGrowthLogRequest request) {
        GrowthLog growthLog = growthLogRepository.findByIdAndIsDeletedFalse(growthLogId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROWTH_LOG_NOT_FOUND));

        // 작성자 확인
        if (!growthLog.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.GROWTH_LOG_ACCESS_DENIED);
        }

        // 성장기록 업데이트 (상태, 공개 범위 포함)
        growthLog.update(request.getTitle(), request.getContent(), request.getThumbnailUrl(),
                request.getStatus(), request.getVisibility());
        growthLogRepository.save(growthLog);

        // 태그 업데이트
        if (request.getTags() != null) {
            if (request.getTags().size() > 5) {
                throw new CustomException(ErrorCode.MAX_TAGS_EXCEEDED);
            }
            // 기존 태그 제거
            growthLogTagRepository.deleteByGrowthLogId(growthLogId);
            // 새 태그 추가
            if (!request.getTags().isEmpty()) {
                attachTagsToGrowthLog(growthLogId, request.getTags());
            }
        }

        log.info("성장기록 수정 완료 - growthLogId: {}", growthLogId);
        return getGrowthLogDetail(growthLogId, userId);
    }

    /**
     * 성장기록 검색 (키워드 + 검색 타입) - 공개 + 발행 성장기록만 검색
     */
    @Transactional(readOnly = true)
    public Page<GrowthLogResponse> searchGrowthLogs(String keyword, GrowthLogSearchType searchType, Pageable pageable, Long currentUserId) {
        Page<GrowthLog> growthLogs;

        switch (searchType) {
            case CONTENT:
                growthLogs = growthLogRepository.searchPublicPublishedByContent(keyword, pageable);
                break;
            case AUTHOR:
                growthLogs = growthLogRepository.searchPublicPublishedByAuthor(keyword, pageable);
                break;
            case TAG:
                growthLogs = growthLogRepository.searchPublicPublishedByTag(keyword, pageable);
                break;
            case TITLE:
            default:
                growthLogs = growthLogRepository.searchPublicPublishedByTitle(keyword, pageable);
                break;
        }

        return growthLogs.map(g -> buildGrowthLogResponse(g, currentUserId));
    }

    /**
     * 피드 성장기록 검색 (키워드 + 검색 타입)
     */
    @Transactional(readOnly = true)
    public Page<GrowthLogResponse> searchFeedGrowthLogs(String keyword, GrowthLogSearchType searchType, Pageable pageable, Long currentUserId) {
        Page<GrowthLog> growthLogs;

        switch (searchType) {
            case CONTENT:
                growthLogs = growthLogRepository.searchWithVotesByContent(keyword, currentUserId, pageable);
                break;
            case AUTHOR:
                growthLogs = growthLogRepository.searchWithVotesByAuthor(keyword, currentUserId, pageable);
                break;
            case TAG:
                growthLogs = growthLogRepository.searchWithVotesByTag(keyword, currentUserId, pageable);
                break;
            case TITLE:
            default:
                growthLogs = growthLogRepository.searchWithVotesByTitle(keyword, currentUserId, pageable);
                break;
        }

        return growthLogs.map(g -> buildGrowthLogResponse(g, currentUserId));
    }

    /**
     * 내 성장기록 목록 조회 (상태 필터 가능)
     */
    @Transactional(readOnly = true)
    public Page<GrowthLogResponse> getMyGrowthLogs(Long userId, GrowthLogStatus status, Pageable pageable) {
        Page<GrowthLog> growthLogs;
        if (status != null) {
            growthLogs = growthLogRepository.findByUser_IdAndStatusAndIsDeletedFalse(userId, status, pageable);
        } else {
            growthLogs = growthLogRepository.findByUser_IdAndIsDeletedFalse(userId, pageable);
        }
        return growthLogs.map(g -> buildGrowthLogResponse(g, userId));
    }

    /**
     * 성장기록 발행
     */
    @Transactional
    public GrowthLogDetailResponse publishGrowthLog(Long growthLogId, Long userId) {
        GrowthLog growthLog = growthLogRepository.findByIdAndIsDeletedFalse(growthLogId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROWTH_LOG_NOT_FOUND));

        // 작성자 확인
        if (!growthLog.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.GROWTH_LOG_ACCESS_DENIED);
        }

        growthLog.publish();
        growthLogRepository.save(growthLog);

        log.info("성장기록 발행 완료 - growthLogId: {}, userId: {}", growthLogId, userId);
        return buildGrowthLogDetailResponse(growthLog, userId);
    }

    /**
     * 임시저장 성장기록 갯수 조회
     */
    @Transactional(readOnly = true)
    public long countMyDraftGrowthLogs(Long userId) {
        return growthLogRepository.countByUser_IdAndStatusAndIsDeletedFalse(userId, GrowthLogStatus.DRAFT);
    }

    /**
     * 공개 범위 변경
     */
    @Transactional
    public GrowthLogDetailResponse changeVisibility(Long growthLogId, Long userId, GrowthLogVisibility visibility) {
        GrowthLog growthLog = growthLogRepository.findByIdAndIsDeletedFalse(growthLogId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROWTH_LOG_NOT_FOUND));

        // 작성자 확인
        if (!growthLog.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.GROWTH_LOG_ACCESS_DENIED);
        }

        growthLog.changeVisibility(visibility);
        growthLogRepository.save(growthLog);

        log.info("성장기록 공개 범위 변경 완료 - growthLogId: {}, visibility: {}", growthLogId, visibility);
        return buildGrowthLogDetailResponse(growthLog, userId);
    }

    // ========== Private Helper 메소드 ==========

    /**
     * 성장기록 접근 권한 검증
     * - 본인 성장기록: 항상 접근 가능
     * - 타인 성장기록: PUBLISHED + PUBLIC만 접근 가능
     */
    private void validateGrowthLogAccess(GrowthLog growthLog, Long currentUserId) {
        // 본인 성장기록은 항상 접근 가능
        if (currentUserId != null && growthLog.isOwnedBy(currentUserId)) {
            return;
        }

        // 타인 성장기록은 공개+발행 상태만 접근 가능
        if (!growthLog.isPublished() || !growthLog.isPublic()) {
            throw new CustomException(ErrorCode.GROWTH_LOG_ACCESS_DENIED);
        }
    }

    /**
     * 태그 연결
     */
    private void attachTagsToGrowthLog(Long growthLogId, List<String> tagNames) {
        for (String tagName : tagNames) {
            final String normalizedTagName = tagName.trim().toLowerCase();
            if (normalizedTagName.isEmpty()) continue;

            // 태그 조회 또는 생성
            Tag tag = tagRepository.findByNameAndIsDeletedFalse(normalizedTagName)
                    .orElseGet(() -> {
                        Tag newTag = Tag.builder()
                                .name(normalizedTagName)
                                .build();
                        return tagRepository.save(newTag);
                    });

            // 중복 체크
            if (!growthLogTagRepository.existsByGrowthLogIdAndTagId(growthLogId, tag.getId())) {
                GrowthLogTag growthLogTag = GrowthLogTag.builder()
                        .growthLogId(growthLogId)
                        .tagId(tag.getId())
                        .tag(tag)
                        .build();
                growthLogTagRepository.save(growthLogTag);

                // 태그 사용 횟수 증가
                tag.incrementUseCount();
                tagRepository.save(tag);
            }
        }
    }

    /**
     * GrowthLogDetailResponse 빌드 (상세용)
     */
    private GrowthLogDetailResponse buildGrowthLogDetailResponse(GrowthLog growthLog, Long currentUserId) {
        GrowthLogDetailResponse response = GrowthLogDetailResponse.from(growthLog);

        // 작성자 닉네임 및 프로필 이미지
        userRepository.findById(growthLog.getUserId()).ifPresent(user -> {
            response.setUserNickname(user.getNickname());
            response.setProfileImageUrl(user.getProfileImageUrl());
        });

        // 추천 여부 (현재 사용자)
        if (currentUserId != null) {
            boolean isVoted = growthLogVoteRepository.existsByGrowthLogEntity_IdAndUser_Id(growthLog.getId(), currentUserId);
            response.setIsVotedByCurrentUser(isVoted);
        }

        // 태그 목록 (JOIN FETCH로 N+1 방지)
        List<GrowthLogTag> growthLogTags = growthLogTagRepository.findByGrowthLogIdWithTag(growthLog.getId());
        List<GrowthLogTagResponse> tags = growthLogTags.stream()
                .map(gt -> GrowthLogTagResponse.from(gt.getTag()))
                .collect(Collectors.toList());
        response.setTags(tags);

        // 댓글 개수
        long commentCount = growthLogCommentRepository.countByGrowthLogEntity_IdAndIsDeletedFalse(growthLog.getId());
        response.setCommentCount((int) commentCount);

        return response;
    }

    /**
     * 연관 엔티티 Soft Delete
     */
    private void softDeleteRelatedEntities(Long growthLogId) {
        // 댓글들 Soft Delete
        List<GrowthLogComment> comments = growthLogCommentRepository.findByGrowthLogEntity_Id(growthLogId);
        comments.forEach(comment -> {
            comment.markAsDeleted();
            growthLogCommentRepository.save(comment);
        });
    }

    /**
     * GrowthLogResponse 빌드 (목록용)
     */
    private GrowthLogResponse buildGrowthLogResponse(GrowthLog growthLog, Long currentUserId) {
        GrowthLogResponse response = GrowthLogResponse.from(growthLog);

        // 작성자 닉네임 및 프로필 이미지
        userRepository.findById(growthLog.getUserId()).ifPresent(user -> {
            response.setUserNickname(user.getNickname());
        });

        // 태그 목록 (JOIN FETCH로 N+1 방지)
        List<GrowthLogTag> growthLogTags = growthLogTagRepository.findByGrowthLogIdWithTag(growthLog.getId());
        List<GrowthLogTagResponse> tags = growthLogTags.stream()
                .map(gt -> GrowthLogTagResponse.from(gt.getTag()))
                .collect(Collectors.toList());
        response.setTags(tags);

        return response;
    }
}
