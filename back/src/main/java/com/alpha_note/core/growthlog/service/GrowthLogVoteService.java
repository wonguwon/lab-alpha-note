package com.alpha_note.core.growthlog.service;

import com.alpha_note.core.growthlog.entity.GrowthLog;
import com.alpha_note.core.growthlog.entity.GrowthLogVote;
import com.alpha_note.core.growthlog.repository.GrowthLogRepository;
import com.alpha_note.core.growthlog.repository.GrowthLogVoteRepository;
import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GrowthLogVoteService {

    private final GrowthLogRepository growthLogRepository;
    private final GrowthLogVoteRepository growthLogVoteRepository;

    /**
     * 성장기록 추천
     */
    @Transactional
    public void voteGrowthLog(Long growthLogId, Long userId) {
        // 성장기록 존재 확인
        GrowthLog growthLog = growthLogRepository.findByIdAndIsDeletedFalse(growthLogId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROWTH_LOG_NOT_FOUND));

        // 중복 추천 체크
        if (growthLogVoteRepository.existsByGrowthLogIdAndUserId(growthLogId, userId)) {
            throw new CustomException(ErrorCode.VOTE_ALREADY_EXISTS);
        }

        // 추천 생성
        GrowthLogVote vote = GrowthLogVote.builder()
                .growthLogId(growthLogId)
                .userId(userId)
                .build();
        growthLogVoteRepository.save(vote);

        // 추천 수 증가
        growthLog.incrementVoteCount();
        growthLogRepository.save(growthLog);

        log.info("성장기록 추천 완료 - growthLogId: {}, userId: {}", growthLogId, userId);
    }

    /**
     * 성장기록 추천 취소
     */
    @Transactional
    public void unvoteGrowthLog(Long growthLogId, Long userId) {
        // 성장기록 존재 확인
        GrowthLog growthLog = growthLogRepository.findByIdAndIsDeletedFalse(growthLogId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROWTH_LOG_NOT_FOUND));

        // 추천 기록 확인
        if (!growthLogVoteRepository.existsByGrowthLogIdAndUserId(growthLogId, userId)) {
            throw new CustomException(ErrorCode.VOTE_NOT_FOUND);
        }

        // 추천 삭제
        growthLogVoteRepository.deleteByGrowthLogIdAndUserId(growthLogId, userId);

        // 추천 수 감소
        growthLog.decrementVoteCount();
        growthLogRepository.save(growthLog);

        log.info("성장기록 추천 취소 완료 - growthLogId: {}, userId: {}", growthLogId, userId);
    }

    /**
     * 성장기록 추천 여부 확인
     */
    @Transactional(readOnly = true)
    public boolean isGrowthLogVoted(Long growthLogId, Long userId) {
        return growthLogVoteRepository.existsByGrowthLogIdAndUserId(growthLogId, userId);
    }
}
