package com.alpha_note.core.qna.repository;

import com.alpha_note.core.qna.entity.QuestionVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionVoteRepository extends JpaRepository<QuestionVote, Long> {

    // 특정 사용자의 특정 질문 투표 조회
    Optional<QuestionVote> findByQuestionEntity_IdAndUser_Id(Long questionId, Long userId);

    // 투표 존재 여부 (중복 체크)
    boolean existsByQuestionEntity_IdAndUser_Id(Long questionId, Long userId);

    // 질문별 투표 수
    long countByQuestionEntity_Id(Long questionId);

    // 사용자별 투표 목록
    List<QuestionVote> findByUser_Id(Long userId);

    // 질문별 모든 투표 조회
    List<QuestionVote> findByQuestionEntity_Id(Long questionId);

    // 특정 투표 삭제
    @Modifying
    @Query("DELETE FROM QuestionVote qv WHERE qv.questionEntity.id = :questionId AND qv.user.id = :userId")
    void deleteByQuestionIdAndUserId(@Param("questionId") Long questionId, @Param("userId") Long userId);

    // 질문별 모든 투표 삭제 (질문 삭제 시)
    @Modifying
    @Query("DELETE FROM QuestionVote qv WHERE qv.questionEntity.id = :questionId")
    void deleteByQuestionId(@Param("questionId") Long questionId);
}
