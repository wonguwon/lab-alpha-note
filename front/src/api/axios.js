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

// Request 인터셉터 - 토큰 자동 첨부
api.interceptors.request.use(
  (config) => {
    if (getAuthStore) {
      const token = getAuthStore().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response 인터셉터 - 에러 처리 및 응답 형식 통일
api.interceptors.response.use(
  (response) => {
    const data = response.data;

    // 서버 응답 형식: { status: 'success'|'error', message, data, code }
    // 또는 구 형식: { success: true|false, message, data, errorCode }

    const isSuccess = data.status === 'success' || data.success === true;

    if (!isSuccess) {
      // 성공이 아닌 응답을 에러로 변환
      const error = new Error(data.message || '요청 처리 실패');
      error.response = {
        data: {
          message: data.message,
          errorCode: data.errorCode,
          status: response.status,
          data: data.data
        }
      };
      return Promise.reject(error);
    }

    // 성공 시 data만 반환 (컴포넌트에서 바로 사용)
    return data.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // 401 Unauthorized - 인증 오류
      if (status === 401) {
        const isLoginPage = window.location.pathname === '/login';
        const isSignupPage = window.location.pathname === '/signup';

        // 로그인/회원가입 페이지가 아닌 경우에만 자동 로그아웃
        if (!isLoginPage && !isSignupPage && getAuthStore) {
          getAuthStore().logout();
          window.location.href = '/login';
        }
      }

      // 에러 메시지 표준화
      const errorMessage = data?.message || getDefaultErrorMessage(status);

      // 에러 객체 표준화
      const standardError = new Error(errorMessage);
      standardError.response = {
        data: {
          message: errorMessage,
          errorCode: data?.errorCode,
          status: status,
          data: data?.data  // 원본 data 포함 (recoveryToken 등)
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
