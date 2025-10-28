import api from './axios';
import { API_ENDPOINTS } from './config';

// 인증 관련 API 서비스
// axios interceptor에서 이미 response.data를 반환하므로
// 응답 형식: { success, message, data, errorCode }
export const authService = {
  // 로그인
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response; // { success, message, data: { token, user }, errorCode }
  },

  // 회원가입
  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response; // { success, message, data, errorCode }
  },

  // 로그아웃
  logout: async () => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response; // { success, message, data, errorCode }
  },

  // 현재 로그인한 사용자 정보 조회 (토큰 기반)
  getUserInfo: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response; // { success, message, data: { user }, errorCode }
  },

  // 이메일 인증 코드 발송
  sendEmailVerification: async (email) => {
    const response = await api.post(API_ENDPOINTS.AUTH.EMAIL_SEND, { email });
    return response; // { success, message, data, errorCode }
  },

  // 이메일 인증 코드 확인
  verifyEmail: async (email, code) => {
    const response = await api.post(API_ENDPOINTS.AUTH.EMAIL_VERIFY, { email, code });
    return response; // { success, message, data, errorCode }
  },

  // 이메일 중복 확인
  checkEmailAvailability: async (email) => {
    const response = await api.post(API_ENDPOINTS.AUTH.EMAIL_CHECK, { email });
    return response; // { success, message, data: { available }, errorCode }
  },
};

// 사용자 관련 API 서비스
export const userService = {

  // 프로필 조회
  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.USER.PROFILE);
    return response; // { success, message, data: { profile }, errorCode }
  },

  // 프로필 수정
  updateProfile: async (profileData) => {
    const response = await api.put(API_ENDPOINTS.USER.UPDATE_PROFILE, profileData);
    return response; // { success, message, data, errorCode }
  },
};


// 에러 처리 래퍼 함수
export const withErrorHandling = (apiCall) => {
  return async (...args) => {
    try {
      return await apiCall(...args);
    } catch (error) {
      // 에러를 그대로 throw하여 컴포넌트에서 처리할 수 있도록 함
      throw error;
    }
  };
};

// 사용 예시:
// const response = await authService.login({ email, password });
// if (response.success) {
//   const { token, user } = response.data;
//   setToken(token);
// }