package com.alpha_note.core.habit.repository;

import com.alpha_note.core.habit.entity.Habit;
import com.alpha_note.core.habit.enums.HabitStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long>, JpaSpecificationExecutor<Habit> {

    /**
     * 습관 ID와 상태로 조회
     */
    Optional<Habit> findByIdAndStatus(Long id, HabitStatus status);

    /**
     * 습관 ID와 상태가 DELETED가 아닌 것으로 조회
     */
    Optional<Habit> findByIdAndStatusNot(Long id, HabitStatus status);

    /**
     * 상태로 조회 (페이징) - 전체 습관 조회용
     */
    Page<Habit> findByStatus(HabitStatus status, Pageable pageable);

    /**
     * 상태가 아닌 것으로 조회 (페이징) - 전체 습관 조회용
     */
    Page<Habit> findByStatusNot(HabitStatus status, Pageable pageable);

    /**
     * 사용자로 조회 (페이징)
     */
    Page<Habit> findByUser_Id(Long userId, Pageable pageable);

    /**
     * 사용자로 조회 + 상태 (페이징)
     */
    Page<Habit> findByUser_IdAndStatus(Long userId, HabitStatus status, Pageable pageable);

    /**
     * 사용자로 조회 + 상태 제외 (페이징)
     */
    Page<Habit> findByUser_IdAndStatusNot(Long userId, HabitStatus status, Pageable pageable);

    /**
     * 사용자로 조회 + 상태 (리스트)
     */
    List<Habit> findByUser_IdAndStatus(Long userId, HabitStatus status);

    /**
     * 사용자로 조회 + 상태 제외 (리스트)
     */
    List<Habit> findByUser_IdAndStatusNot(Long userId, HabitStatus status);

    /**
     * 습관 존재 확인
     */
    boolean existsByIdAndStatusNot(Long id, HabitStatus status);

    /**
     * 사용자의 습관 개수 조회 (상태별)
     */
    long countByUser_IdAndStatus(Long userId, HabitStatus status);

    /**
     * 사용자의 습관 개수 조회 (DELETED 제외)
     */
    long countByUser_IdAndStatusNot(Long userId, HabitStatus status);

    // ===== 검색 메서드 =====

    /**
     * 제목으로 검색 (DELETED 제외)
     */
    @Query("SELECT h FROM Habit h WHERE h.title LIKE %:keyword% AND h.status != 'DELETED'")
    Page<Habit> searchByTitle(@Param("keyword") String keyword, Pageable pageable);

    /**
     * 제목으로 검색 + 사용자 ID 필터
     */
    @Query("SELECT h FROM Habit h WHERE h.user.id = :userId AND h.title LIKE %:keyword% AND h.status != 'DELETED'")
    Page<Habit> searchByTitleAndUserId(@Param("userId") Long userId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 제목으로 검색 + 상태 필터
     */
    @Query("SELECT h FROM Habit h WHERE h.title LIKE %:keyword% AND h.status = :status")
    Page<Habit> searchByTitleAndStatus(@Param("keyword") String keyword, @Param("status") HabitStatus status, Pageable pageable);

    /**
     * 제목으로 검색 + 사용자 ID + 상태 필터
     */
    @Query("SELECT h FROM Habit h WHERE h.user.id = :userId AND h.title LIKE %:keyword% AND h.status = :status")
    Page<Habit> searchByTitleAndUserIdAndStatus(@Param("userId") Long userId, @Param("keyword") String keyword, @Param("status") HabitStatus status, Pageable pageable);

    /**
     * 작성자 닉네임으로 검색 (DELETED 제외)
     */
    @Query("SELECT h FROM Habit h JOIN h.user u WHERE u.nickname LIKE %:keyword% AND h.status != 'DELETED'")
    Page<Habit> searchByAuthor(@Param("keyword") String keyword, Pageable pageable);

    /**
     * 작성자 닉네임으로 검색 + 상태 필터
     */
    @Query("SELECT h FROM Habit h JOIN h.user u WHERE u.nickname LIKE %:keyword% AND h.status = :status")
    Page<Habit> searchByAuthorAndStatus(@Param("keyword") String keyword, @Param("status") HabitStatus status, Pageable pageable);

    /**
     * 제목 또는 작성자 닉네임으로 검색 (ALL 타입)
     */
    @Query("SELECT h FROM Habit h LEFT JOIN h.user u WHERE (h.title LIKE %:keyword% OR u.nickname LIKE %:keyword%) AND h.status != 'DELETED'")
    Page<Habit> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
