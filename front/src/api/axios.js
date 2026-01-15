import axios from 'axios';
import { API_CONFIG } from './config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Zustand 스토어를 동적으로 가져오는 함수 (순환 참조 방지)
let getAuthStore = null;
export const setAuthStoreGetter = (getter) => {
  getAuthStore = getter;
};

// Request 인터셉터
// 쿠키가 자동으로 전송되므로 Authorization 헤더를 별도로 설정하지 않음
// (하위 호환성을 위해 필요 시 헤더 기반 인증도 지원 가능)
api.interceptors.request.use(
  (config) => {
    // withCredentials 설정 (쿠키 전송을 위해 필요)
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

// 리프레시 토큰 갱신 중 플래그 (무한 루프 방지)
let isRefreshing = false;
let failedQueue = [];

// 대기 중인 요청 처리
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response 인터셉터 - 에러 처리 및 응답 형식 통일
api.interceptors.response.use(
  (response) => {
    // HTTP 200은 항상 성공으로 처리 (표준 HTTP 상태 코드 기반)
    // 성공 시 data만 반환 (컴포넌트에서 바로 사용)
    return response.data.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;

      // 401 Unauthorized - 인증 오류
      if (status === 401) {
        const isLoginPage = window.location.pathname === '/login';
        const isSignupPage = window.location.pathname === '/signup';
        const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh');

        // 리프레시 엔드포인트 자체가 401이면 로그아웃 처리 (refresh_token도 없거나 만료됨)
        if (isRefreshEndpoint) {
          if (!isLoginPage && !isSignupPage && getAuthStore) {
            getAuthStore().logout();
            window.location.href = '/login';
          }
          const errorMessage = data?.message || getDefaultErrorMessage(status);
          const standardError = new Error(errorMessage);
          standardError.response = {
            status: error.response.status,
            statusText: error.response.statusText,
            headers: error.response.headers,
            data: {
              ...data,
              message: errorMessage,
              errorCode: data?.errorCode || data?.code,
              status: status
            }
          };
          return Promise.reject(standardError);
        }

        // 리프레시 중이 아닌 경우 리프레시 시도 (access_token이 없거나 만료됨)
        // refresh_token이 있으면 새 access_token을 발급받아 로그인 유지
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            // 리프레시 토큰으로 새 액세스 토큰 발급
            const { authService } = await import('./services');
            await authService.refreshToken();

            // 대기 중인 요청 처리
            processQueue(null, null);

            // 원래 요청 재시도
            return api(originalRequest);
          } catch (refreshError) {
            // 리프레시 실패 시 대기 중인 요청 모두 실패 처리
            processQueue(refreshError, null);

            // 리프레시 실패 = refresh_token도 없거나 만료됨 → 로그아웃
            if (!isLoginPage && !isSignupPage && getAuthStore) {
              console.log('리프레시 토큰 없음 또는 만료 - 자동 로그아웃');
              getAuthStore().logout();
              window.location.href = '/login';
            }

            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          // 리프레시 중인 경우 대기 큐에 추가
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return api(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }
      }

      // 에러 메시지 표준화
      const errorMessage = data?.message || getDefaultErrorMessage(status);

      // 에러 객체 표준화 (원본 데이터 보존)
      const standardError = new Error(errorMessage);
      standardError.response = {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: {
          ...data,  // 원본 data 전체 보존
          // 명시적으로 필드 확인 (fallback)
          message: errorMessage,
          errorCode: data?.errorCode || data?.code,
          status: status
        }
      };

      return Promise.reject(standardError);
    } else if (error.request) {
      // 네트워크 오류
      const networkError = new Error('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
      networkError.response = {
        data: {
          message: networkError.message,
          code: 'NETWORK_ERROR'
        }
      };
      return Promise.reject(networkError);
    } else {
      // 요청 설정 오류
      return Promise.reject(error);
    }
  }
);

// 상태 코드별 기본 에러 메시지
const getDefaultErrorMessage = (status) => {
  const messages = {
    400: '잘못된 요청입니다.',
    401: '인증이 필요합니다.',
    403: '접근 권한이 없습니다.',
    404: '요청한 리소스를 찾을 수 없습니다.',
    409: '이미 존재하는 데이터입니다.',
    422: '입력 데이터가 올바르지 않습니다.',
    500: '서버 오류가 발생했습니다.',
    502: '게이트웨이 오류가 발생했습니다.',
    503: '서비스를 사용할 수 없습니다.'
  };
  return messages[status] || '요청 처리 중 오류가 발생했습니다.';
};

export default api;
