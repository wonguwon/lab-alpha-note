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
    RECOVER: '/auth/recover',
    ME: '/auth/me',
    EMAIL_SEND: '/auth/email/send',
    EMAIL_VERIFY: '/auth/email/verify',
    EMAIL_CHECK: '/auth/email/check',
  },
  // 사용자 관련
  USER: {
    ME: '/users/me',
    UPDATE_PASSWORD: '/users/me/password',
    UPDATE_EMAIL: '/users/me/email',
    UPDATE_PROFILE_IMAGE: '/users/me/profile-image',
    DELETE_PROFILE_IMAGE: '/users/me/profile-image',
  },
  // 스토리지 관련
  STORAGE: {
    PRESIGNED_URL: '/storage/presigned-url',
  },
  // QnA 관련
  QNA: {
    QUESTIONS: '/qna/questions',
    QUESTIONS_SEARCH: '/qna/questions/search',
    QUESTION_DETAIL: (id) => `/qna/questions/${id}`,
    ANSWERS: (questionId) => `/qna/questions/${questionId}/answers`,
    ANSWER_DETAIL: (answerId) => `/qna/answers/${answerId}`,
    QUESTION_COMMENTS: (questionId) => `/qna/questions/${questionId}/comments`,
    ANSWER_COMMENTS: (answerId) => `/qna/answers/${answerId}/comments`,
    QUESTION_COMMENT_DETAIL: (commentId) => `/qna/comments/question/${commentId}`,
    ANSWER_COMMENT_DETAIL: (commentId) => `/qna/comments/answer/${commentId}`,
    QUESTION_VOTE: (questionId) => `/qna/questions/${questionId}/vote`,
    ANSWER_VOTE: (answerId) => `/qna/answers/${answerId}/vote`,
  },
};
