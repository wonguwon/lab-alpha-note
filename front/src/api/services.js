import api from './axios';
import { API_ENDPOINTS } from './config';

// 인증 관련 API 서비스
// axios interceptor가 자동으로 data만 반환하므로 바로 사용 가능
export const authService = {
  // 로그인 - 반환: { token, user }
  login: async (credentials) => {
    return await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  // 회원가입
  register: async (userData) => {
    return await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  },

  // 로그아웃
  logout: async () => {
    return await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  // 현재 로그인한 사용자 정보 조회 - 반환: { user }
  getUserInfo: async () => {
    return await api.get(API_ENDPOINTS.AUTH.ME);
  },

  // 이메일 인증 코드 발송
  sendEmailVerification: async (email) => {
    return await api.post(API_ENDPOINTS.AUTH.EMAIL_SEND, { email });
  },

  // 이메일 인증 코드 확인
  verifyEmail: async (email, code) => {
    return await api.post(API_ENDPOINTS.AUTH.EMAIL_VERIFY, { email, code });
  },

  // 이메일 중복 확인 - 반환: { available }
  checkEmailAvailability: async (email) => {
    return await api.post(API_ENDPOINTS.AUTH.EMAIL_CHECK, { email });
  },
};

// 사용자 관련 API 서비스
// axios interceptor가 자동으로 data만 반환
export const userService = {
  // 프로필 업데이트 (닉네임) - 반환: User 객체
  updateProfile: async (data) => {
    return await api.patch(API_ENDPOINTS.USER.ME, data);
  },

  // 비밀번호 변경 - 반환: null
  updatePassword: async (currentPassword, newPassword) => {
    return await api.patch(API_ENDPOINTS.USER.UPDATE_PASSWORD, {
      currentPassword,
      newPassword
    });
  },

  // 이메일 변경 - 반환: User 객체
  updateEmail: async (newEmail) => {
    return await api.patch(API_ENDPOINTS.USER.UPDATE_EMAIL, {
      newEmail
    });
  },

  // 프로필 이미지 업로드 - 반환: User 객체
  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return await api.post(API_ENDPOINTS.USER.UPLOAD_PROFILE_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 프로필 이미지 삭제 - 반환: User 객체
  deleteProfileImage: async () => {
    return await api.delete(API_ENDPOINTS.USER.DELETE_PROFILE_IMAGE);
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