package com.alpha_note.core.growthlog.repository;

import com.alpha_note.core.growthlog.entity.GrowthLog;
import com.alpha_note.core.growthlog.enums.GrowthLogStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GrowthLogRepository extends JpaRepository<GrowthLog, Long> {

    // 기본 조회
    Optional<GrowthLog> findByIdAndIsDeletedFalse(Long id);

    // 전체 성장기록 페이징 조회 (활성만, 최신순)
    Page<GrowthLog> findAllByIsDeletedFalse(Pageable pageable);

    // 공개 + 발행 성장기록만 조회 (공개 목록용)
    @Query("SELECT g FROM GrowthLog g WHERE g.isDeleted = false AND g.status = 'PUBLISHED' AND g.visibility = 'PUBLIC'")
    Page<GrowthLog> findAllPublicPublished(Pageable pageable);

    // 내 성장기록 전체 조회
    Page<GrowthLog> findByUserIdAndIsDeletedFalse(Long userId, Pageable pageable);

    // 내 성장기록 상태별 조회
    Page<GrowthLog> findByUserIdAndStatusAndIsDeletedFalse(Long userId, GrowthLogStatus status, Pageable pageable);

    // 제목만 검색
    @Query("SELECT g FROM GrowthLog g WHERE g.title LIKE %:keyword% AND g.isDeleted = false")
    Page<GrowthLog> searchByTitle(@Param("keyword") String keyword, Pageable pageable);

    // 내용만 검색
    @Query("SELECT g FROM GrowthLog g WHERE g.content LIKE %:keyword% AND g.isDeleted = false")
    Page<GrowthLog> searchByContent(@Param("keyword") String keyword, Pageable pageable);

    // 작성자 닉네임으로 검색
    @Query("SELECT DISTINCT g FROM GrowthLog g JOIN User u ON g.userId = u.id WHERE u.nickname LIKE %:keyword% AND g.isDeleted = false")
    Page<GrowthLog> searchByAuthor(@Param("keyword") String keyword, Pageable pageable);

    // 태그명으로 검색
    @Query("SELECT DISTINCT g FROM GrowthLog g JOIN GrowthLogTag gt ON g.id = gt.growthLogId JOIN Tag t ON gt.tagId = t.id " +
            "WHERE g.isDeleted = false and t.name = :keyword AND t.isDeleted = false")
    Page<GrowthLog> searchByTag(@Param("keyword") String keyword, Pageable pageable);

    // 공개+발행 성장기록 검색 (제목)
    @Query("SELECT g FROM GrowthLog g WHERE g.title LIKE %:keyword% AND g.isDeleted = false AND g.status = 'PUBLISHED' AND g.visibility = 'PUBLIC'")
    Page<GrowthLog> searchPublicPublishedByTitle(@Param("keyword") String keyword, Pageable pageable);

    // 공개+발행 성장기록 검색 (내용)
    @Query("SELECT g FROM GrowthLog g WHERE g.content LIKE %:keyword% AND g.isDeleted = false AND g.status = 'PUBLISHED' AND g.visibility = 'PUBLIC'")
    Page<GrowthLog> searchPublicPublishedByContent(@Param("keyword") String keyword, Pageable pageable);

    // 공개+발행 성장기록 검색 (작성자)
    @Query("SELECT DISTINCT g FROM GrowthLog g JOIN User u ON g.userId = u.id WHERE u.nickname LIKE %:keyword% AND g.isDeleted = false AND g.status = 'PUBLISHED' AND g.visibility = 'PUBLIC'")
    Page<GrowthLog> searchPublicPublishedByAuthor(@Param("keyword") String keyword, Pageable pageable);

    // 공개+발행 성장기록 검색 (태그)
    @Query("SELECT DISTINCT g FROM GrowthLog g JOIN GrowthLogTag gt ON g.id = gt.growthLogId JOIN Tag t ON gt.tagId = t.id " +
            "WHERE g.isDeleted = false AND t.name = :keyword AND t.isDeleted = false AND g.status = 'PUBLISHED' AND g.visibility = 'PUBLIC'")
    Page<GrowthLog> searchPublicPublishedByTag(@Param("keyword") String keyword, Pageable pageable);

    // 피드 목록 - 투표한 건만 검색
    @Query("SELECT DISTINCT g FROM GrowthLog g JOIN GrowthLogVote v ON g.id = v.growthLogId WHERE g.isDeleted = false and v.userId = :userId")
    Page<GrowthLog> findAllWithVotesByUserId(Long userId, Pageable pageable);

    // 제목만 검색
    @Query("SELECT DISTINCT g FROM GrowthLog g JOIN GrowthLogVote v ON g.id = v.growthLogId " +
            "WHERE g.isDeleted = false and g.title LIKE %:keyword% AND v.userId = :userId")
    Page<GrowthLog> searchWithVotesByTitle(@Param("keyword") String keyword, Long userId, Pageable pageable);

    // 내용만 검색
    @Query("SELECT DISTINCT g FROM GrowthLog g JOIN GrowthLogVote v ON g.id = v.growthLogId " +
            "WHERE g.isDeleted = false and g.content LIKE %:keyword% AND g.isDeleted = false AND v.userId = :userId")
    Page<GrowthLog> searchWithVotesByContent(@Param("keyword") String keyword, Long userId, Pageable pageable);

    // 작성자 닉네임으로 검색
    @Query("SELECT DISTINCT g FROM GrowthLog g JOIN User u ON g.userId = u.id JOIN GrowthLogVote v ON g.id = v.growthLogId " +
            "WHERE g.isDeleted = false AND u.nickname LIKE %:keyword% AND v.userId = :userId")
    Page<GrowthLog> searchWithVotesByAuthor(@Param("keyword") String keyword, Long userId, Pageable pageable);

    // 태그명으로 검색
    @Query("SELECT DISTINCT g FROM GrowthLog g JOIN GrowthLogTag gt ON g.id = gt.growthLogId JOIN Tag t ON gt.tagId = t.id JOIN GrowthLogVote v ON g.id = v.growthLogId " +
            "WHERE g.isDeleted = false and t.name = :keyword AND t.isDeleted = false AND v.userId = :userId")
    Page<GrowthLog> searchWithVotesByTag(@Param("keyword") String keyword, Long userId, Pageable pageable);

    // 사용자별 상태별 성장기록 갯수 조회
    long countByUserIdAndStatusAndIsDeletedFalse(Long userId, GrowthLogStatus status);
}
