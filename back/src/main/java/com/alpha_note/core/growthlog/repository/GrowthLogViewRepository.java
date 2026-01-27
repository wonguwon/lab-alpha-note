package com.alpha_note.core.growthlog.repository;

import com.alpha_note.core.growthlog.entity.GrowthLogView;
import com.alpha_note.core.growthlog.entity.GrowthLogViewId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GrowthLogViewRepository extends JpaRepository<GrowthLogView, GrowthLogViewId> {

    /**
     * 특정 사용자가 특정 성장기록을 조회한 적이 있는지 확인
     */
    boolean existsByIdGrowthLogIdAndIdUserId(Long growthLogId, Long userId);
}
