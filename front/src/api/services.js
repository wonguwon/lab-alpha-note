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

  // 계정 복구 - 반환: { token, nickname, email, role }
  recoverAccount: async (recoveryToken) => {
    return await api.post(API_ENDPOINTS.AUTH.RECOVER, null, {
      headers: {
        Authorization: `Bearer ${recoveryToken}`
      }
    });
  },

  // 리프레시 토큰으로 새 액세스 토큰 발급
  refreshToken: async () => {
    return await api.post(API_ENDPOINTS.AUTH.REFRESH);
  },

  // OAuth2 회원가입 - 반환: { token, nickname, email, role }
  oauth2Register: async (tempToken, nickname, emailSubscribed) => {
    return await api.post(API_ENDPOINTS.AUTH.OAUTH2_REGISTER, {
      tempToken,
      nickname,
      emailSubscribed
    });
  },

  // 비밀번호 찾기 요청 (재설정 링크 발송)
  requestPasswordReset: async (email) => {
    return await api.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_REQUEST, { email });
  },

  // 비밀번호 재설정
  confirmPasswordReset: async (token, newPassword, confirmPassword) => {
    return await api.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM, {
      token,
      newPassword,
      confirmPassword
    });
  },
};

// 스토리지 관련 API 서비스
export const storageService = {
  // Presigned URL 발급 - 반환: { uploadUrl, fileUrl, key, expiresIn }
  getPresignedUrl: async (fileName, contentType, filePath, fileSize) => {
    return await api.post(API_ENDPOINTS.STORAGE.PRESIGNED_URL, {
      fileName,
      contentType,
      filePath,
      fileSize
    });
  },

  // S3에 파일 직접 업로드
  uploadToS3: async (presignedUrl, file, contentType) => {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': contentType,
      },
    });

    if (!response.ok) {
      throw new Error('S3 업로드 실패');
    }

    return response;
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

  // 프로필 이미지 업로드 (S3 Presigned URL 사용) - 반환: User 객체
  uploadProfileImage: async (file, userId) => {
    // 1. Presigned URL 발급
    const { uploadUrl, fileUrl } = await storageService.getPresignedUrl(
      file.name,
      file.type,
      `public/profiles/user-${userId}`,
      file.size
    );

    // 2. S3에 파일 직접 업로드
    await storageService.uploadToS3(uploadUrl, file, file.type);

    // 3. 백엔드에 프로필 이미지 URL 업데이트
    return await api.patch(API_ENDPOINTS.USER.UPDATE_PROFILE_IMAGE, {
      profileImageUrl: fileUrl
    });
  },

  // 프로필 이미지 삭제 - 반환: User 객체
  deleteProfileImage: async () => {
    return await api.delete(API_ENDPOINTS.USER.DELETE_PROFILE_IMAGE);
  },

  // 회원탈퇴 - 반환: null
  deleteAccount: async (password, reason) => {
    const requestData = {};

    // password가 있는 경우에만 추가 (LOCAL 사용자)
    if (password) {
      requestData.password = password;
    }

    // reason이 있는 경우에만 추가
    if (reason) {
      requestData.reason = reason;
    }

    return await api.delete(API_ENDPOINTS.USER.ME, {
      data: requestData
    });
  },

  // 이메일 수신동의 변경 - 반환: User 객체
  updateEmailSubscription: async (emailSubscribed) => {
    return await api.patch(API_ENDPOINTS.USER.EMAIL_SUBSCRIPTION, {
      emailSubscribed
    });
  },
};

// QnA 관련 API 서비스
export const qnaService = {
  // 질문 목록 조회 - 반환: { content: [], page, size, totalElements, totalPages }
  getQuestions: async (params) => {
    return await api.get(API_ENDPOINTS.QNA.QUESTIONS, { params });
  },

  // 질문 검색 - 반환: { content: [], page, size, totalElements, totalPages }
  searchQuestions: async (params) => {
    return await api.get(API_ENDPOINTS.QNA.QUESTIONS_SEARCH, { params });
  },

  // 사용자별 질문 조회 - 반환: { content: [], page, size, totalElements, totalPages }
  getQuestionsByUser: async (userId, params) => {
    return await api.get(API_ENDPOINTS.QNA.QUESTIONS_BY_USER(userId), { params });
  },

  // 질문 상세 조회 - 반환: Question 객체
  getQuestionDetail: async (id) => {
    return await api.get(API_ENDPOINTS.QNA.QUESTION_DETAIL(id));
  },

  // 질문 작성 - 반환: Question 객체
  createQuestion: async (data) => {
    return await api.post(API_ENDPOINTS.QNA.QUESTIONS, data);
  },

  // 질문 수정 - 반환: Question 객체
  updateQuestion: async (id, data) => {
    return await api.put(API_ENDPOINTS.QNA.QUESTION_DETAIL(id), data);
  },

  // 질문 삭제 - 반환: null
  deleteQuestion: async (id) => {
    return await api.delete(API_ENDPOINTS.QNA.QUESTION_DETAIL(id));
  },

  // 답변 목록 조회 - 반환: Answer 배열
  getAnswers: async (questionId) => {
    return await api.get(API_ENDPOINTS.QNA.ANSWERS(questionId));
  },

  // 답변 작성 - 반환: Answer 객체
  createAnswer: async (questionId, data) => {
    return await api.post(API_ENDPOINTS.QNA.ANSWERS(questionId), data);
  },

  // 답변 수정 - 반환: Answer 객체
  updateAnswer: async (answerId, data) => {
    return await api.put(API_ENDPOINTS.QNA.ANSWER_DETAIL(answerId), data);
  },

  // 답변 삭제 - 반환: null
  deleteAnswer: async (answerId) => {
    return await api.delete(API_ENDPOINTS.QNA.ANSWER_DETAIL(answerId));
  },

  // 질문 댓글 목록 조회 - 반환: Comment 배열
  getQuestionComments: async (questionId) => {
    return await api.get(API_ENDPOINTS.QNA.QUESTION_COMMENTS(questionId));
  },

  // 질문 댓글 작성 - 반환: Comment 객체
  createQuestionComment: async (questionId, data) => {
    return await api.post(API_ENDPOINTS.QNA.QUESTION_COMMENTS(questionId), data);
  },

  // 질문 댓글 수정 - 반환: Comment 객체
  updateQuestionComment: async (commentId, data) => {
    return await api.put(API_ENDPOINTS.QNA.QUESTION_COMMENT_DETAIL(commentId), data);
  },

  // 질문 댓글 삭제 - 반환: null
  deleteQuestionComment: async (commentId) => {
    return await api.delete(API_ENDPOINTS.QNA.QUESTION_COMMENT_DETAIL(commentId));
  },

  // 답변 댓글 목록 조회 - 반환: Comment 배열
  getAnswerComments: async (answerId) => {
    return await api.get(API_ENDPOINTS.QNA.ANSWER_COMMENTS(answerId));
  },

  // 답변 댓글 작성 - 반환: Comment 객체
  createAnswerComment: async (answerId, data) => {
    return await api.post(API_ENDPOINTS.QNA.ANSWER_COMMENTS(answerId), data);
  },

  // 답변 댓글 수정 - 반환: Comment 객체
  updateAnswerComment: async (commentId, data) => {
    return await api.put(API_ENDPOINTS.QNA.ANSWER_COMMENT_DETAIL(commentId), data);
  },

  // 답변 댓글 삭제 - 반환: null
  deleteAnswerComment: async (commentId) => {
    return await api.delete(API_ENDPOINTS.QNA.ANSWER_COMMENT_DETAIL(commentId));
  },

  // 질문 추천 - 반환: Question 객체
  voteQuestion: async (questionId) => {
    return await api.post(API_ENDPOINTS.QNA.QUESTION_VOTE(questionId));
  },

  // 질문 추천 취소 - 반환: Question 객체
  unvoteQuestion: async (questionId) => {
    return await api.delete(API_ENDPOINTS.QNA.QUESTION_VOTE(questionId));
  },

  // 답변 추천 - 반환: Answer 객체
  voteAnswer: async (answerId) => {
    return await api.post(API_ENDPOINTS.QNA.ANSWER_VOTE(answerId));
  },

  // 답변 추천 취소 - 반환: Answer 객체
  unvoteAnswer: async (answerId) => {
    return await api.delete(API_ENDPOINTS.QNA.ANSWER_VOTE(answerId));
  },
};

// Habit 관련 API 서비스
export const habitService = {
  // 습관 목록 조회 - 반환: Page<Habit>
  getHabits: async (params = {}) => {
    return await api.get(API_ENDPOINTS.HABIT.HABITS, { params });
  },

  // 습관 대시보드 조회 (습관 목록 + 잔디 캘린더) - 반환: HabitDashboardResponse
  getHabitDashboard: async (params = {}) => {
    return await api.get(API_ENDPOINTS.HABIT.HABIT_DASHBOARD, { params });
  },

  // 습관 생성 - 반환: Habit 객체
  createHabit: async (data) => {
    return await api.post(API_ENDPOINTS.HABIT.HABITS, data);
  },

  // 습관 상세 조회 - 반환: Habit 객체
  getHabit: async (id) => {
    return await api.get(API_ENDPOINTS.HABIT.HABIT_DETAIL(id));
  },

  // 습관 수정 - 반환: Habit 객체
  updateHabit: async (id, data) => {
    return await api.put(API_ENDPOINTS.HABIT.HABIT_DETAIL(id), data);
  },

  // 습관 삭제 - 반환: null
  deleteHabit: async (id) => {
    return await api.delete(API_ENDPOINTS.HABIT.HABIT_DETAIL(id));
  },

  // 습관 통계 조회 - 반환: HabitStats 객체
  getHabitStats: async (id) => {
    return await api.get(API_ENDPOINTS.HABIT.HABIT_STATS(id));
  },

  // 습관 보관 - 반환: Habit 객체
  archiveHabit: async (id) => {
    return await api.post(API_ENDPOINTS.HABIT.HABIT_ARCHIVE(id));
  },

  // 습관 활성화 - 반환: Habit 객체
  activateHabit: async (id) => {
    return await api.post(API_ENDPOINTS.HABIT.HABIT_ACTIVATE(id));
  },

  // 습관 기록 목록 조회 - 반환: Page<HabitRecord>
  getHabitRecords: async (habitId, params = {}) => {
    return await api.get(API_ENDPOINTS.HABIT.HABIT_RECORDS(habitId), { params });
  },

  // 습관 기록 생성 - 반환: HabitRecord 객체
  createHabitRecord: async (habitId, data) => {
    return await api.post(API_ENDPOINTS.HABIT.HABIT_RECORDS(habitId), data);
  },

  // 습관 기록 상세 조회 - 반환: HabitRecord 객체
  getHabitRecord: async (habitId, recordId) => {
    return await api.get(API_ENDPOINTS.HABIT.HABIT_RECORD_DETAIL(habitId, recordId));
  },

  // 습관 기록 수정 - 반환: HabitRecord 객체
  updateHabitRecord: async (habitId, recordId, data) => {
    return await api.put(API_ENDPOINTS.HABIT.HABIT_RECORD_DETAIL(habitId, recordId), data);
  },

  // 습관 기록 삭제 - 반환: null
  deleteHabitRecord: async (habitId, recordId) => {
    return await api.delete(API_ENDPOINTS.HABIT.HABIT_RECORD_DETAIL(habitId, recordId));
  },

  // 특정 날짜의 기록 조회 - 반환: HabitRecord 배열
  getHabitRecordByDate: async (habitId, date) => {
    return await api.get(API_ENDPOINTS.HABIT.HABIT_RECORD_BY_DATE(habitId, date));
  },

  // 월별 캘린더 데이터 조회 - 반환: HabitCalendar 객체
  getHabitCalendar: async (habitId, params = {}) => {
    return await api.get(API_ENDPOINTS.HABIT.HABIT_CALENDAR(habitId), {
      params
    });
  },
};


// Blog 관련 API 서비스
export const blogService = {
  // 블로그 목록 조회 - 반환: Page<Blog>
  getBlogs: async (params = {}) => {
    return await api.get(API_ENDPOINTS.BLOG.BLOGS, { params });
  },

  // 블로그 검색 - 반환: Page<Blog>
  searchBlogs: async (params = {}) => {
    return await api.get(API_ENDPOINTS.BLOG.BLOG_SEARCH, { params });
  },

  // 블로그 생성 - 반환: Blog 객체
  createBlog: async (data) => {
    return await api.post(API_ENDPOINTS.BLOG.BLOGS, data);
  },

  // 블로그 상세 조회 - 반환: Blog 객체
  getBlog: async (id) => {
    return await api.get(API_ENDPOINTS.BLOG.BLOG_DETAIL(id));
  },

  // 블로그 수정 - 반환: Blog 객체
  updateBlog: async (id, data) => {
    return await api.put(API_ENDPOINTS.BLOG.BLOG_DETAIL(id), data);
  },

  // 블로그 삭제 - 반환: null
  deleteBlog: async (id) => {
    return await api.delete(API_ENDPOINTS.BLOG.BLOG_DETAIL(id));
  },

  // 블로그 댓글 목록 조회
  getComments: async (blogId) => {
    return await api.get(API_ENDPOINTS.BLOG.BLOG_COMMENTS(blogId));
  },

  // 블로그 댓글 작성
  createComment: async (blogId, data) => {
    return await api.post(API_ENDPOINTS.BLOG.BLOG_COMMENTS(blogId), data);
  },

  // 블로그 댓글 수정
  updateComment: async (commentId, data) => {
    return await api.put(API_ENDPOINTS.BLOG.BLOG_COMMENT_DETAIL(commentId), data);
  },

  // 블로그 댓글 삭제
  deleteComment: async (commentId) => {
    return await api.delete(API_ENDPOINTS.BLOG.BLOG_COMMENT_DETAIL(commentId));
  },

  // 블로그 추천
  voteBlog: async (blogId) => {
    return await api.post(API_ENDPOINTS.BLOG.BLOG_VOTE(blogId));
  },

  // 블로그 추천 취소
  unvoteBlog: async (blogId) => {
    return await api.delete(API_ENDPOINTS.BLOG.BLOG_VOTE(blogId));
  },

  // 내 블로그 목록 조회 - 반환: Page<Blog>
  getMyBlogs: async (params = {}) => {
    return await api.get(API_ENDPOINTS.BLOG.MY_BLOGS, { params });
  },

  // 블로그 발행 (임시저장 → 발행) - 반환: Blog 객체
  publishBlog: async (id) => {
    return await api.post(API_ENDPOINTS.BLOG.BLOG_PUBLISH(id));
  },

  // 블로그 공개범위 변경 - 반환: Blog 객체
  changeVisibility: async (id, visibility) => {
    return await api.patch(API_ENDPOINTS.BLOG.BLOG_VISIBILITY(id), { visibility });
  },

  // 임시저장 블로그 갯수 조회 - 반환: number
  getDraftCount: async () => {
    return await api.get(API_ENDPOINTS.BLOG.DRAFT_COUNT);
  },
};


// Support 관련 API 서비스
export const supportService = {
  // 문의사항 전송 - 반환: { success, message, data }
  submitContact: async (data) => {
    return await api.post(API_ENDPOINTS.SUPPORT.CONTACT, data);
  },
};

// 알림 관련 API 서비스
export const notificationService = {
  // 알림 목록 조회 - 반환: Page<Notification>
  getNotifications: async (params = {}) => {
    return await api.get(API_ENDPOINTS.NOTIFICATION.NOTIFICATIONS, { params });
  },

  // 읽지 않은 알림 개수 조회 - 반환: { unreadCount }
  getUnreadCount: async () => {
    return await api.get(API_ENDPOINTS.NOTIFICATION.UNREAD_COUNT);
  },

  // 알림 읽음 처리 - 반환: { success, message }
  markAsRead: async (id) => {
    return await api.patch(API_ENDPOINTS.NOTIFICATION.MARK_AS_READ(id));
  },

  // 전체 알림 읽음 처리 - 반환: { success, message }
  markAllAsRead: async () => {
    return await api.patch(API_ENDPOINTS.NOTIFICATION.MARK_ALL_AS_READ);
  },
};

// Goal 관련 API 서비스
export const goalService = {
  // 목표 생성/업데이트 - 반환: YearlyGoal 객체
  createYearlyGoal: async (data) => {
    return await api.post(API_ENDPOINTS.GOAL.GOALS, data);
  },

  // 목표 수정 - 반환: YearlyGoal 객체
  updateYearlyGoal: async (id, data) => {
    return await api.patch(API_ENDPOINTS.GOAL.GOAL_DETAIL(id), data);
  },

  // 목표 달성 여부 토글 - 반환: YearlyGoal 객체
  toggleGoalItem: async (id, goalIndex) => {
    return await api.patch(API_ENDPOINTS.GOAL.GOAL_TOGGLE(id), { goalIndex });
  },

  // 목표 삭제 - 반환: null
  deleteYearlyGoal: async (id) => {
    return await api.delete(API_ENDPOINTS.GOAL.GOAL_DETAIL(id));
  },

  // 내 목표 조회 (특정 연도) - 반환: YearlyGoal 객체
  getMyYearlyGoal: async (year) => {
    return await api.get(API_ENDPOINTS.GOAL.MY_GOAL_BY_YEAR(year));
  },

  // 내 모든 목표 조회 - 반환: YearlyGoal 배열
  getAllMyYearlyGoals: async () => {
    return await api.get(API_ENDPOINTS.GOAL.MY_GOALS);
  },

  // 공개 목표 조회 (특정 연도) - 반환: YearlyGoal 배열
  getPublicYearlyGoals: async (year) => {
    return await api.get(API_ENDPOINTS.GOAL.PUBLIC_GOALS(year));
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