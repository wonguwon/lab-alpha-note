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
    // 성공 응답: { success: true, message, data, errorCode }
    // response.data만 반환하여 컴포넌트에서 바로 사용 가능하도록 함
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // 로그인 페이지에서의 401은 interceptor에서 처리하지 않음 (컴포넌트에서 처리)
          // 다른 페이지에서의 401만 로그인 페이지로 리다이렉트
          const isLoginPage = window.location.pathname === '/login';
          if (!isLoginPage && getAuthStore) {
            getAuthStore().logout();
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('접근 권한이 없습니다.');
          break;
        case 404:
          console.error('요청한 리소스를 찾을 수 없습니다.');
          break;
        case 422:
          console.error('입력 데이터 검증 오류:', data.message || data);
          break;
        case 500:
          console.error('서버 내부 오류가 발생했습니다.');
          break;
        default:
          console.error('API 오류:', data?.message || data);
      }
    } else if (error.request) {
      // 네트워크 오류
      console.error('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    } else {
      console.error('요청 설정 오류:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
