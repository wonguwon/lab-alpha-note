import { create } from 'zustand';
import { notificationService } from '../api/services';
import { API_CONFIG } from '../api/config';

const useNotificationStore = create((set, get) => {
  let eventSource = null;

  return {
    // 상태
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    isConnected: false,

    // 알림 추가
    addNotification: (notification) => {
      set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }));
    },

    // 알림 목록 조회
    fetchNotifications: async (params = {}) => {
      set({ isLoading: true, error: null });
      try {
        const response = await notificationService.getNotifications(params);
        set({ notifications: response.content || response, isLoading: false });
      } catch (error) {
        console.error('알림 목록 조회 실패:', error);
        set({ error: error.response?.data?.message || '알림 목록을 불러올 수 없습니다.', isLoading: false });
      }
    },

    // 읽지 않은 알림 개수 조회
    fetchUnreadCount: async () => {
      try {
        const response = await notificationService.getUnreadCount();
        set({ unreadCount: response.unreadCount || 0 });
      } catch (error) {
        console.error('읽지 않은 알림 개수 조회 실패:', error);
      }
    },

    // 알림 읽음 처리
    markAsRead: async (id) => {
      try {
        await notificationService.markAsRead(id);
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      } catch (error) {
        console.error('알림 읽음 처리 실패:', error);
        throw error;
      }
    },

    // 전체 알림 읽음 처리
    markAllAsRead: async () => {
      try {
        await notificationService.markAllAsRead();
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        }));
      } catch (error) {
        console.error('전체 알림 읽음 처리 실패:', error);
        throw error;
      }
    },

    // 에러 초기화
    clearError: () => {
      set({ error: null });
    },

    // SSE 연결 시작
    connectSSE: () => {
      const state = get();
      
      // 이미 연결되어 있으면 종료
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }

      // SSE 엔드포인트 URL 생성
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const streamUrl = `${apiBaseUrl}/api/v1/notifications/stream`;

      try {
        // EventSource 생성 (쿠키가 자동으로 전송됨)
        eventSource = new EventSource(streamUrl, { withCredentials: true });

        // 연결 성공 시
        eventSource.onopen = () => {
          console.log('SSE 연결 성공');
          set({ isConnected: true });
        };

        // 알림 수신 시
        eventSource.addEventListener('notification', (event) => {
          try {
            const notification = JSON.parse(event.data);
            console.log('새 알림 수신:', notification);
            
            // 알림 추가 및 읽지 않은 개수 증가
            set((state) => ({
              notifications: [notification, ...state.notifications],
              unreadCount: state.unreadCount + 1,
            }));
          } catch (error) {
            console.error('알림 파싱 오류:', error);
          }
        });

        // 연결 확인 메시지
        eventSource.addEventListener('connect', (event) => {
          console.log('SSE 연결 확인:', event.data);
        });

        // 오류 발생 시
        eventSource.onerror = (error) => {
          console.error('SSE 연결 오류:', error);
          set({ isConnected: false });
          
          // 연결이 끊어졌을 때 자동 재연결 시도 (5초 후)
          if (eventSource?.readyState === EventSource.CLOSED) {
            setTimeout(() => {
              const currentState = get();
              // 사용자가 로그아웃하지 않았고 연결이 끊어진 경우에만 재연결
              if (!currentState.isConnected) {
                console.log('SSE 재연결 시도...');
                get().connectSSE();
              }
            }, 5000);
          }
        };

      } catch (error) {
        console.error('SSE 연결 생성 실패:', error);
        set({ isConnected: false, error: '알림 연결에 실패했습니다.' });
      }
    },

    // SSE 연결 종료
    disconnectSSE: () => {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
        console.log('SSE 연결 종료');
        set({ isConnected: false });
      }
    },
  };
});

export default useNotificationStore;

