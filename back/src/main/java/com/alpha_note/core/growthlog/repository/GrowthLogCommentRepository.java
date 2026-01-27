package com.alpha_note.core.growthlog.repository;

import com.alpha_note.core.growthlog.entity.GrowthLogComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrowthLogCommentRepository extends JpaRepository<GrowthLogComment, Long> {

    // 댓글 수 카운트
    long countByGrowthLogIdAndIsDeletedFalse(Long growthLogId);

    // 특정 성장기록의 모든 댓글 조회 (삭제된 것 포함 - Soft Delete 처리용)
    List<GrowthLogComment> findByGrowthLogId(Long growthLogId);

    // 성장기록별 댓글 조회 (생성일 내림차순 - 최신순)
    List<GrowthLogComment> findByGrowthLogIdAndIsDeletedFalseOrderByCreatedAtDesc(Long growthLogId);
}
