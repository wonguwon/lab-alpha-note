import { create } from 'zustand';
import { notificationService } from '../api/services';
import { API_CONFIG } from '../api/config';
import useAuthStore from './authStore';

const useNotificationStore = create((set, get) => {
  let eventSource = null;
  let reconnectAttempts = 0;
  let reconnectTimer = null;
  const MAX_RECONNECT_ATTEMPTS = 3;
  const INITIAL_RECONNECT_DELAY = 2000; // 2초

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
      // 인증 상태 확인
      const authState = useAuthStore.getState();
      if (!authState.isAuthenticated || !authState.user) {
        console.log('인증되지 않은 상태에서는 SSE 연결을 시도하지 않습니다.');
        return;
      }

      const state = get();
      
      // 이미 연결되어 있으면 종료
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }

      // 재연결 타이머가 있으면 취소
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
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
          reconnectAttempts = 0; // 성공 시 재시도 횟수 리셋
          set({ isConnected: true, error: null });
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
          
          // 인증 상태 재확인
          const currentAuthState = useAuthStore.getState();
          if (!currentAuthState.isAuthenticated || !currentAuthState.user) {
            console.log('인증되지 않은 상태 - SSE 재연결 중단');
            if (eventSource) {
              eventSource.close();
              eventSource = null;
            }
            reconnectAttempts = 0;
            return;
          }

          // 연결이 끊어졌을 때만 재연결 시도
          if (eventSource?.readyState === EventSource.CLOSED) {
            // 최대 재시도 횟수 확인
            if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
              console.error('SSE 최대 재연결 시도 횟수 초과 - 재연결 중단');
              set({ 
                error: '알림 연결에 실패했습니다. 페이지를 새로고침해주세요.' 
              });
              reconnectAttempts = 0;
              return;
            }

            reconnectAttempts++;
            // 지수 백오프: 2초, 4초, 8초
            const delay = Math.min(
              INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts - 1),
              8000
            );

            reconnectTimer = setTimeout(() => {
              // 재연결 전에 다시 인증 상태 확인
              const authState = useAuthStore.getState();
              if (!authState.isAuthenticated || !authState.user) {
                console.log('재연결 시도 전 인증 상태 확인 실패 - 재연결 중단');
                reconnectAttempts = 0;
                return;
              }

              const currentState = get();
              if (!currentState.isConnected) {
                console.log(`SSE 재연결 시도 ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}...`);
                get().connectSSE();
              }
            }, delay);
          }
        };

      } catch (error) {
        console.error('SSE 연결 생성 실패:', error);
        set({ isConnected: false, error: '알림 연결에 실패했습니다.' });
      }
    },

    // SSE 연결 종료
    disconnectSSE: () => {
      // 재연결 타이머 취소
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }

      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
      
      reconnectAttempts = 0; // 재시도 횟수 리셋
      console.log('SSE 연결 종료');
      set({ isConnected: false });
    },
  };
});

export default useNotificationStore;

