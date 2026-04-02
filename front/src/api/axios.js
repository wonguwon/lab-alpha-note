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

// 공개 페이지 목록 (인증 없이 접근 가능한 페이지)
const PUBLIC_PAGES = ['/login', '/signup', '/', '/qna', '/habits', '/contact'];

// 리프레시 시도하지 않을 엔드포인트 목록
const REFRESH_EXCLUDED_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/oauth2/register',
  '/auth/recover',
  '/auth/me',  // 초기 인증 직후 호출 시 쿠키 전파 타이밍 이슈 방지
  '/support/contact' // 비회원 문의하기 전송 허용
];

// 리프레시 토큰 갱신 중 플래그 (무한 루프 방지)
let isRefreshing = false;
let failedQueue = [];

// 에러 객체 생성 헬퍼 함수 (중복 제거)
const createStandardError = (error, data, status) => {
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
  return standardError;
};

// 대기 중인 요청 처리
const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
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
        const currentPath = window.location.pathname;
        // 패턴 매칭으로 공개 페이지 확인 (/signup/social 등 자동 포함)
        const isPublicPage = PUBLIC_PAGES.some(page => currentPath === page || currentPath.startsWith(page + '/'));
        const requestUrl = originalRequest.url || '';
        const isRefreshEndpoint = requestUrl.includes('/auth/refresh');

        // 1) refresh 엔드포인트가 401이면 즉시 로그아웃
        if (isRefreshEndpoint) {
          // 세션 정리 + 로그인 페이지로 리다이렉트
          if (getAuthStore) {
            getAuthStore().logout();
          }
          if (!isPublicPage) {
            window.location.href = '/login';
          }

          return Promise.reject(createStandardError(error, data, status));
        }

        // 리프레시 제외 엔드포인트 확인
        const isExcludedEndpoint = REFRESH_EXCLUDED_ENDPOINTS.some(
          endpoint => requestUrl.includes(endpoint)
        );

        if (isExcludedEndpoint) {
          return Promise.reject(createStandardError(error, data, status));
        }

        // 2) 원요청은 딱 1번만 refresh 후 재시도
        if (originalRequest._retry) {
          // 이미 한 번 retry했는데도 401이면 에러 반환
          return Promise.reject(createStandardError(error, data, status));
        }

        // 3) 동시 요청일 때 refresh는 한 번만 (isRefreshing + queue 패턴)
        if (!isRefreshing) {
          isRefreshing = true;
          originalRequest._retry = true; // retry 플래그 설정

          try {
            // 리프레시 토큰으로 새 액세스 토큰 발급
            const { authService } = await import('./services');
            await authService.refreshToken();

            // 대기 중인 요청 처리
            processQueue(null);

            // 원래 요청 재시도
            return api(originalRequest);
          } catch (refreshError) {
            // 리프레시 실패 시 대기 중인 요청 모두 실패 처리
            processQueue(refreshError);

            // 리프레시 실패 = refresh_token도 없거나 만료됨
            if (!isPublicPage && getAuthStore) {
              console.log('리프레시 토큰 없음 또는 만료 - 자동 로그아웃');
              getAuthStore().logout();
              window.location.href = '/login';
            } else {
              if (getAuthStore) {
                getAuthStore().logout();
              }
            }

            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          // 리프레시 중인 경우 대기 큐에 추가
          // ✅ queue에 들어가는 요청도 _retry 플래그 설정
          originalRequest._retry = true;
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
