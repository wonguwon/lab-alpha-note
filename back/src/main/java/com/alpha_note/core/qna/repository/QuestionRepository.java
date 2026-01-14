package com.alpha_note.core.qna.repository;

import com.alpha_note.core.qna.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // 기본 조회
    Optional<Question> findByIdAndIsDeletedFalse(Long id);

    // 사용자별 질문 조회 (Pageable의 sort 사용)
    Page<Question> findByUserIdAndIsDeletedFalse(Long userId, Pageable pageable);
    List<Question> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(Long userId);

    // 전체 질문 페이징 조회 (Pageable의 sort 사용)
    Page<Question> findAllByIsDeletedFalse(Pageable pageable);

    // 답변 여부별 조회 (최신순)
    Page<Question> findByIsAnsweredAndIsDeletedFalseOrderByCreatedAtDesc(Boolean isAnswered, Pageable pageable);

    // 제목 + 내용 검색 (JPQL, Pageable의 sort 사용)
    @Query("SELECT q FROM Question q WHERE (q.title LIKE %:keyword% OR q.content LIKE %:keyword%) AND q.isDeleted = false")
    Page<Question> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // 제목만 검색 (Pageable의 sort 사용)
    @Query("SELECT q FROM Question q WHERE q.title LIKE %:keyword% AND q.isDeleted = false")
    Page<Question> searchByTitle(@Param("keyword") String keyword, Pageable pageable);

    // 내용만 검색 (Pageable의 sort 사용)
    @Query("SELECT q FROM Question q WHERE q.content LIKE %:keyword% AND q.isDeleted = false")
    Page<Question> searchByContent(@Param("keyword") String keyword, Pageable pageable);

    // 작성자 닉네임으로 검색 (Pageable의 sort 사용)
    @Query("SELECT q FROM Question q JOIN User u ON q.userId = u.id WHERE u.nickname LIKE %:keyword% AND q.isDeleted = false")
    Page<Question> searchByAuthor(@Param("keyword") String keyword, Pageable pageable);

    // 태그별 질문 조회 (태그 ID로, Pageable의 sort 사용)
    @Query("SELECT q FROM Question q JOIN q.questionTags qt WHERE qt.tagId = :tagId AND q.isDeleted = false")
    Page<Question> findByTagId(@Param("tagId") Long tagId, Pageable pageable);

    // 태그별 질문 조회 (태그 이름으로, Pageable의 sort 사용)
    @Query("SELECT q FROM Question q JOIN q.questionTags qt JOIN qt.tag t WHERE t.name = :tagName AND q.isDeleted = false")
    Page<Question> findByTagName(@Param("tagName") String tagName, Pageable pageable);

    // 인기 질문 (조회수 높은 순)
    Page<Question> findAllByIsDeletedFalseOrderByViewCountDesc(Pageable pageable);

    // 추천수 높은 질문
    Page<Question> findAllByIsDeletedFalseOrderByVoteCountDesc(Pageable pageable);

    // 최근 활동 질문
    Page<Question> findAllByIsDeletedFalseOrderByLastActivityAtDesc(Pageable pageable);

    // 조회수 증가 (벌크 업데이트)
    @Modifying
    @Query("UPDATE Question q SET q.viewCount = q.viewCount + 1 WHERE q.id = :id")
    void incrementViewCount(@Param("id") Long id);

    // 통계: 전체 질문 수
    long countByIsDeletedFalse();

    // 통계: 사용자별 질문 수
    long countByUserIdAndIsDeletedFalse(Long userId);

    // 통계: 미답변 질문 수
    long countByIsAnsweredFalseAndIsDeletedFalse();
}
