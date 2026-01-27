const {
  VITE_API_URL,
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
    OAUTH2_REGISTER: '/auth/oauth2/register',
    RECOVER: '/auth/recover',
    ME: '/auth/me',
    EMAIL_SEND: '/auth/email/send',
    EMAIL_VERIFY: '/auth/email/verify',
    EMAIL_CHECK: '/auth/email/check',
    PASSWORD_RESET_REQUEST: '/auth/password/reset/request',
    PASSWORD_RESET_CONFIRM: '/auth/password/reset/confirm',
  },
  // 사용자 관련
  USER: {
    ME: '/users/me',
    UPDATE_PASSWORD: '/users/me/password',
    UPDATE_EMAIL: '/users/me/email',
    UPDATE_PROFILE_IMAGE: '/users/me/profile-image',
    DELETE_PROFILE_IMAGE: '/users/me/profile-image',
    EMAIL_SUBSCRIPTION: '/users/me/email-subscription',
  },
  // 스토리지 관련
  STORAGE: {
    PRESIGNED_URL: '/storage/presigned-url',
  },
  // QnA 관련
  QNA: {
    QUESTIONS: '/qna/questions',
    QUESTIONS_SEARCH: '/qna/questions/search',
    QUESTIONS_BY_USER: (userId) => `/qna/questions/user/${userId}`,
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
  // Habit 관련
  HABIT: {
    HABITS: '/habits',
    HABIT_DASHBOARD: '/habits/dashboard',
    HABIT_DETAIL: (id) => `/habits/${id}`,
    HABIT_STATS: (id) => `/habits/${id}/stats`,
    HABIT_ARCHIVE: (id) => `/habits/${id}/archive`,
    HABIT_ACTIVATE: (id) => `/habits/${id}/activate`,
    HABIT_RECORDS: (habitId) => `/habits/${habitId}/records`,
    HABIT_RECORD_DETAIL: (habitId, recordId) => `/habits/${habitId}/records/${recordId}`,
    HABIT_RECORD_BY_DATE: (habitId, date) => `/habits/${habitId}/records/date/${date}`,
    HABIT_CALENDAR: (habitId) => `/habits/${habitId}/records/calendar`,
  },
  // GrowthLog 관련
  GROWTH_LOG: {
    GROWTH_LOGS: '/growth-logs',
    GROWTH_LOG_SEARCH: '/growth-logs/search',
    GROWTH_LOG_DETAIL: (id) => `/growth-logs/${id}`,
    GROWTH_LOG_COMMENTS: (growthLogId) => `/growth-logs/${growthLogId}/comments`,
    GROWTH_LOG_COMMENT_DETAIL: (commentId) => `/growth-logs/comments/${commentId}`,
    GROWTH_LOG_VOTE: (growthLogId) => `/growth-logs/${growthLogId}/vote`,
    MY_GROWTH_LOGS: '/growth-logs/me',
    GROWTH_LOG_PUBLISH: (id) => `/growth-logs/${id}/publish`,
    GROWTH_LOG_VISIBILITY: (id) => `/growth-logs/${id}/visibility`,
    DRAFT_COUNT: '/growth-logs/me/draft-count',
  },
  // Support 관련
  SUPPORT: {
    CONTACT: '/support/contact',
  },
  // 알림 관련
  NOTIFICATION: {
    STREAM: '/notifications/stream',
    NOTIFICATIONS: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_AS_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_AS_READ: '/notifications/read-all',
  },
  // Goal 관련
  GOAL: {
    GOALS: '/goals',
    GOAL_DETAIL: (id) => `/goals/${id}`,
    GOAL_TOGGLE: (id) => `/goals/${id}/toggle`,
    MY_GOALS: '/goals/me',
    MY_GOAL_BY_YEAR: (year) => `/goals/me/${year}`,
    PUBLIC_GOALS: (year) => `/goals/public/${year}`,
  },
};
