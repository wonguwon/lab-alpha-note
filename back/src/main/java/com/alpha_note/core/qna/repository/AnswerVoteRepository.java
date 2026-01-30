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
    Optional<AnswerVote> findByAnswerEntity_IdAndUser_Id(Long answerId, Long userId);

    // 투표 존재 여부 (중복 체크)
    boolean existsByAnswerEntity_IdAndUser_Id(Long answerId, Long userId);

    // 답변별 투표 수
    long countByAnswerEntity_Id(Long answerId);

    // 사용자별 투표 목록
    List<AnswerVote> findByUser_Id(Long userId);

    // 답변별 모든 투표 조회
    List<AnswerVote> findByAnswerEntity_Id(Long answerId);

    // 특정 투표 삭제
    @Modifying
    @Query("DELETE FROM AnswerVote av WHERE av.answerEntity.id = :answerId AND av.user.id = :userId")
    void deleteByAnswerIdAndUserId(@Param("answerId") Long answerId, @Param("userId") Long userId);

    // 답변별 모든 투표 삭제 (답변 삭제 시)
    @Modifying
    @Query("DELETE FROM AnswerVote av WHERE av.answerEntity.id = :answerId")
    void deleteByAnswerId(@Param("answerId") Long answerId);
}
