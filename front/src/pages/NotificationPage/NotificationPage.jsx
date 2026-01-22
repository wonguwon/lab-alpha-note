import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../../store/notificationStore';
import {
  NotificationContainer,
  NotificationHeader,
  PageTitle,
  ActionButton,
  NotificationList,
  NotificationItem,
  NotificationItemContent,
  NotificationTitle,
  NotificationContent,
  NotificationTime,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  LoadingState,
} from './NotificationPage.styled';

const NotificationPage = () => {
  const navigate = useNavigate();
  const { notifications, isLoading, fetchNotifications, markAsRead, markAllAsRead, fetchUnreadCount } = useNotificationStore();
  const [filter, setFilter] = useState(null); // null: 전체, true: 읽음, false: 안 읽음

  useEffect(() => {
    fetchNotifications({ isRead: filter, page: 0, size: 50 });
    fetchUnreadCount();
  }, [filter, fetchNotifications, fetchUnreadCount]);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // 관련 엔티티로 이동
    if (notification.relatedEntityType === 'QUESTION' && notification.relatedEntityId) {
      navigate(`/qna/${notification.relatedEntityId}`);
    } else if (notification.relatedEntityType === 'ANSWER' && notification.relatedEntityId) {
      // 답변으로 이동하려면 질문 ID가 필요하므로, 일단 질문 상세 페이지로 이동
      navigate(`/qna`);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      await fetchUnreadCount();
    } catch (error) {
      console.error('전체 읽음 처리 실패:', error);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  if (isLoading && notifications.length === 0) {
    return (
      <NotificationContainer>
        <NotificationHeader>
          <PageTitle>알림</PageTitle>
        </NotificationHeader>
        <LoadingState>로딩 중...</LoadingState>
      </NotificationContainer>
    );
  }

  return (
    <NotificationContainer>
      <NotificationHeader>
        <PageTitle>알림</PageTitle>
        <ActionButton onClick={handleMarkAllAsRead}>전체 읽음</ActionButton>
      </NotificationHeader>

      <NotificationList>
        {notifications.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🔔</EmptyIcon>
            <EmptyTitle>알림이 없습니다</EmptyTitle>
            <EmptyDescription>새로운 알림이 도착하면 여기에 표시됩니다.</EmptyDescription>
          </EmptyState>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              $isRead={notification.isRead}
              onClick={() => handleNotificationClick(notification)}
            >
              <NotificationItemContent>
                <NotificationTitle $isRead={notification.isRead}>
                  {notification.title}
                </NotificationTitle>
                <NotificationContent>{notification.content}</NotificationContent>
                <NotificationTime>{formatTimeAgo(notification.createdAt)}</NotificationTime>
              </NotificationItemContent>
            </NotificationItem>
          ))
        )}
      </NotificationList>
    </NotificationContainer>
  );
};

export default NotificationPage;

