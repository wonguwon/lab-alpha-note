package com.alpha_note.core.growthlog.repository;

import com.alpha_note.core.growthlog.entity.GrowthLogTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrowthLogTagRepository extends JpaRepository<GrowthLogTag, Long> {

    // 성장기록별 태그 조회
    List<GrowthLogTag> findByGrowthLogId(Long growthLogId);

    // 성장기록별 태그 조회 (Tag JOIN FETCH - N+1 방지)
    @Query("SELECT gt FROM GrowthLogTag gt JOIN FETCH gt.tag t WHERE gt.growthLogId = :growthLogId AND t.isDeleted = false")
    List<GrowthLogTag> findByGrowthLogIdWithTag(@Param("growthLogId") Long growthLogId);

    // 존재 여부
    boolean existsByGrowthLogIdAndTagId(Long growthLogId, Long tagId);

    // 성장기록별 모든 태그 삭제
    @Modifying
    @Query("DELETE FROM GrowthLogTag gt WHERE gt.growthLogId = :growthLogId")
    void deleteByGrowthLogId(@Param("growthLogId") Long growthLogId);
}
