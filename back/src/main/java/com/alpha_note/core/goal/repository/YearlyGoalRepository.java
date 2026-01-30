package com.alpha_note.core.goal.repository;

import com.alpha_note.core.goal.entity.YearlyGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface YearlyGoalRepository extends JpaRepository<YearlyGoal, Long> {

    /**
     * 사용자 ID와 연도로 조회
     */
    Optional<YearlyGoal> findByUser_IdAndYear(Long userId, Integer year);

    /**
     * 사용자 ID로 모든 목표 조회 (연도 내림차순)
     */
    List<YearlyGoal> findAllByUser_IdOrderByYearDesc(Long userId);

    /**
     * 특정 연도의 모든 사용자 목표 조회 (메인 페이지용)
     */
    List<YearlyGoal> findAllByYearOrderByCreatedAtDesc(Integer year);
}

