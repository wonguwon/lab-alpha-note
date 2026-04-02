package com.alpha_note.core.growthlog.service;

import com.alpha_note.core.growthlog.entity.GrowthLogView;
import com.alpha_note.core.growthlog.entity.GrowthLogViewId;
import com.alpha_note.core.growthlog.repository.GrowthLogViewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 성장기록 조회수 추적 서비스
 * - growth_log_views 테이블에 조회 기록 저장
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GrowthLogViewCountService {

    private final GrowthLogViewRepository growthLogViewRepository;

    /**
     * 사용자가 특정 성장기록을 이미 조회했는지 확인
     */
    @Transactional(readOnly = true)
    public boolean hasViewed(Long growthLogId, Long userId) {
        return growthLogViewRepository.existsByIdGrowthLogIdAndIdUserId(growthLogId, userId);
    }

    /**
     * 사용자의 성장기록 조회 기록 저장
     */
    @Transactional
    public void recordView(Long growthLogId, Long userId) {
        // 이미 조회 기록이 있으면 저장하지 않음 (중복 방지)
        GrowthLogViewId viewId = new GrowthLogViewId(growthLogId, userId);

        if (!growthLogViewRepository.existsById(viewId)) {
            GrowthLogView view = GrowthLogView.of(growthLogId, userId);
            growthLogViewRepository.save(view);
            log.debug("성장기록 조회 기록 저장 - growthLogId = {}, userId = {}", growthLogId, userId);
        }
    }
}
