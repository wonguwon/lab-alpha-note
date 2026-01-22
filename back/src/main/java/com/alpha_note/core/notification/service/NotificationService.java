package com.alpha_note.core.notification.service;

import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.notification.dto.response.NotificationResponse;
import com.alpha_note.core.notification.dto.response.UnreadCountResponse;
import com.alpha_note.core.notification.entity.Notification;
import com.alpha_note.core.notification.enums.NotificationType;
import com.alpha_note.core.notification.repository.NotificationRepository;
import com.alpha_note.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    
    // 사용자별 SSE 연결 관리 (동시성 처리)
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();
    
    private static final long SSE_TIMEOUT = 60 * 60 * 1000L; // 1시간

    /**
     * SSE 연결 생성
     */
    public SseEmitter createConnection(Long userId) {
        // 기존 연결이 있으면 제거
        if (emitters.containsKey(userId)) {
            SseEmitter existingEmitter = emitters.remove(userId);
            try {
                existingEmitter.complete();
            } catch (Exception e) {
                log.warn("기존 SSE 연결 종료 중 오류 발생 - userId: {}", userId, e);
            }
        }

        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        
        // 타임아웃 시 제거
        emitter.onTimeout(() -> {
            log.debug("SSE 연결 타임아웃 - userId: {}", userId);
            emitters.remove(userId);
        });

        // 완료 시 제거
        emitter.onCompletion(() -> {
            log.debug("SSE 연결 완료 - userId: {}", userId);
            emitters.remove(userId);
        });

        // 오류 시 제거
        emitter.onError((ex) -> {
            log.warn("SSE 연결 오류 - userId: {}", userId, ex);
            emitters.remove(userId);
        });

        emitters.put(userId, emitter);
        
        // 초기 연결 확인 메시지 전송
        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("연결되었습니다."));
        } catch (IOException e) {
            log.warn("초기 SSE 메시지 전송 실패 - userId: {}", userId, e);
            emitters.remove(userId);
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
        }

        log.info("SSE 연결 생성 - userId: {}", userId);
        return emitter;
    }

    /**
     * 알림 생성 및 전송
     */
    @Transactional
    public Notification createNotification(
            Long userId,
            NotificationType type,
            String title,
            String content,
            String relatedEntityType,
            Long relatedEntityId
    ) {
        // 사용자 존재 확인
        if (!userRepository.existsById(userId)) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .content(content)
                .relatedEntityType(relatedEntityType)
                .relatedEntityId(relatedEntityId)
                .build();

        Notification savedNotification = notificationRepository.save(notification);

        // SSE로 실시간 알림 전송
        sendNotificationToUser(userId, savedNotification);

        log.info("알림 생성 완료 - notificationId: {}, userId: {}, type: {}", 
                savedNotification.getId(), userId, type);

        return savedNotification;
    }

    /**
     * 사용자에게 SSE로 알림 전송
     */
    private void sendNotificationToUser(Long userId, Notification notification) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                NotificationResponse response = NotificationResponse.from(notification);
                emitter.send(SseEmitter.event()
                        .name("notification")
                        .data(response));
                log.debug("SSE 알림 전송 완료 - userId: {}, notificationId: {}", userId, notification.getId());
            } catch (IOException e) {
                log.warn("SSE 알림 전송 실패 - userId: {}, notificationId: {}", userId, notification.getId(), e);
                emitters.remove(userId);
            }
        }
    }

    /**
     * 알림 목록 조회
     */
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotifications(Long userId, Pageable pageable, Boolean isRead) {
        Page<Notification> notifications;
        
        if (isRead == null) {
            // 전체 조회
            notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        } else if (isRead) {
            // 읽은 알림만
            notifications = notificationRepository.findByUserIdAndIsReadTrueOrderByCreatedAtDesc(userId, pageable);
        } else {
            // 읽지 않은 알림만
            notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId, pageable);
        }

        return notifications.map(NotificationResponse::from);
    }

    /**
     * 알림 읽음 처리
     */
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTIFICATION_NOT_FOUND));

        if (!notification.getIsRead()) {
            notification.markAsRead();
            notificationRepository.save(notification);
            log.info("알림 읽음 처리 완료 - notificationId: {}, userId: {}", notificationId, userId);
        }
    }

    /**
     * 전체 알림 읽음 처리
     */
    @Transactional
    public void markAllAsRead(Long userId) {
        int updatedCount = notificationRepository.markAllAsReadByUserId(userId);
        log.info("전체 알림 읽음 처리 완료 - userId: {}, updatedCount: {}", userId, updatedCount);
    }

    /**
     * 읽지 않은 알림 개수 조회
     */
    @Transactional(readOnly = true)
    public UnreadCountResponse getUnreadCount(Long userId) {
        long count = notificationRepository.countByUserIdAndIsReadFalse(userId);
        return UnreadCountResponse.builder()
                .unreadCount(count)
                .build();
    }

    /**
     * SSE 연결 종료
     */
    public void closeConnection(Long userId) {
        SseEmitter emitter = emitters.remove(userId);
        if (emitter != null) {
            try {
                emitter.complete();
            } catch (Exception e) {
                log.warn("SSE 연결 종료 중 오류 발생 - userId: {}", userId, e);
            }
        }
    }
}

