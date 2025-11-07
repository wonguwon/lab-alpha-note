package com.alpha_note.core.qna.repository;

import com.alpha_note.core.qna.entity.AnswerVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerVoteRepository extends JpaRepository<AnswerVote, Long> {

    // 특정 사용자의 특정 답변 투표 조회
    Optional<AnswerVote> findByAnswerIdAndUserId(Long answerId, Long userId);

    // 투표 존재 여부 (중복 체크)
    boolean existsByAnswerIdAndUserId(Long answerId, Long userId);

    // 답변별 투표 수
    long countByAnswerId(Long answerId);

    // 사용자별 투표 목록
    List<AnswerVote> findByUserId(Long userId);

    // 답변별 모든 투표 조회
    List<AnswerVote> findByAnswerId(Long answerId);

    // 특정 투표 삭제
    @Modifying
    @Query("DELETE FROM AnswerVote av WHERE av.answerId = :answerId AND av.userId = :userId")
    void deleteByAnswerIdAndUserId(@Param("answerId") Long answerId, @Param("userId") Long userId);

    // 답변별 모든 투표 삭제 (답변 삭제 시)
    @Modifying
    @Query("DELETE FROM AnswerVote av WHERE av.answerId = :answerId")
    void deleteByAnswerId(@Param("answerId") Long answerId);
}
