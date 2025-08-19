import axios from 'axios';
import { API_CONFIG } from './config';

// 토큰 관리 유틸리티
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const clearToken = () => localStorage.removeItem('token');

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request 인터셉터 - 토큰 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 인증 에러 - 토큰 제거 후 로그인 페이지로
          clearToken();
          window.location.href = '/login';
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

// 토큰 관리 함수들도 export
export { getToken, setToken, clearToken };

export default api;
