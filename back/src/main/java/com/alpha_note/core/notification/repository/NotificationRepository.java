package com.alpha_note.core.notification.repository;

import com.alpha_note.core.notification.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // 사용자별 알림 목록 조회 (최신순)
    Page<Notification> findByUser_IdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    // 사용자별 읽지 않은 알림 목록 조회
    Page<Notification> findByUser_IdAndIsReadFalseOrderByCreatedAtDesc(Long userId, Pageable pageable);

    // 사용자별 읽은 알림 목록 조회
    Page<Notification> findByUser_IdAndIsReadTrueOrderByCreatedAtDesc(Long userId, Pageable pageable);

    // 사용자별 읽지 않은 알림 개수
    long countByUser_IdAndIsReadFalse(Long userId);

    // 특정 알림 조회 (사용자 ID로 검증)
    Optional<Notification> findByIdAndUser_Id(Long id, Long userId);

    // 사용자의 모든 알림을 읽음 처리
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId AND n.isRead = false")
    int markAllAsReadByUserId(@Param("userId") Long userId);
}

