package com.alpha_note.core.growthlog.repository;

import com.alpha_note.core.growthlog.entity.GrowthLogVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GrowthLogVoteRepository extends JpaRepository<GrowthLogVote, Long> {

    // 투표 존재 여부 (중복 체크)
    boolean existsByGrowthLogIdAndUserId(Long growthLogId, Long userId);

    // 특정 투표 삭제
    @Modifying
    @Query("DELETE FROM GrowthLogVote gv WHERE gv.growthLogId = :growthLogId AND gv.userId = :userId")
    void deleteByGrowthLogIdAndUserId(@Param("growthLogId") Long growthLogId, @Param("userId") Long userId);
}
