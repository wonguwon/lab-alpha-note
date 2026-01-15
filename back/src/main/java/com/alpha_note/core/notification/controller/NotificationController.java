package com.alpha_note.core.notification.controller;

import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.notification.dto.response.NotificationResponse;
import com.alpha_note.core.notification.dto.response.UnreadCountResponse;
import com.alpha_note.core.notification.service.NotificationService;
import com.alpha_note.core.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * SSE 연결 엔드포인트
     * GET /api/v1/notifications/stream
     */
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamNotifications(@AuthenticationPrincipal User user) {
        return notificationService.createConnection(user.getId());
    }

    /**
     * 알림 목록 조회 (페이징)
     * GET /api/v1/notifications?isRead=false&page=0&size=20
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> getNotifications(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Boolean isRead,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<NotificationResponse> response = notificationService.getNotifications(user.getId(), pageable, isRead);
        return ResponseEntity.ok(ApiResponse.success("알림 목록 조회 성공", response));
    }

    /**
     * 읽지 않은 알림 개수 조회
     * GET /api/v1/notifications/unread-count
     */
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<UnreadCountResponse>> getUnreadCount(
            @AuthenticationPrincipal User user) {

        UnreadCountResponse response = notificationService.getUnreadCount(user.getId());
        return ResponseEntity.ok(ApiResponse.success("읽지 않은 알림 개수 조회 성공", response));
    }

    /**
     * 알림 읽음 처리
     * PATCH /api/v1/notifications/{id}/read
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("알림이 읽음 처리되었습니다.", null));
    }

    /**
     * 전체 알림 읽음 처리
     * PATCH /api/v1/notifications/read-all
     */
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal User user) {

        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(ApiResponse.success("모든 알림이 읽음 처리되었습니다.", null));
    }
}


