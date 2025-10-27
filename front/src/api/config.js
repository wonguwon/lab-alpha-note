const {
  VITE_API_URL = 'http://localhost:8001',
  VITE_API_TIMEOUT = '5000',
  VITE_API_VERSION = 'v1'
} = import.meta.env;

export const API_CONFIG = {
  BASE_URL: `${VITE_API_URL}/api/${VITE_API_VERSION}`,
  TIMEOUT: Number(VITE_API_TIMEOUT),
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// API 엔드포인트 상수 정의
export const API_ENDPOINTS = {
  // 인증 관련
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    EMAIL_SEND: '/auth/email/send',
    EMAIL_VERIFY: '/auth/email/verify',
  },
  // 사용자 관련
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
  },
};
