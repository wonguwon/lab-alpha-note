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
};

// 스토리지 관련 API 서비스
export const storageService = {
  // Presigned URL 발급 - 반환: { uploadUrl, fileUrl, key, expiresIn }
  getPresignedUrl: async (fileName, contentType, filePath) => {
    return await api.post(API_ENDPOINTS.STORAGE.PRESIGNED_URL, {
      fileName,
      contentType,
      filePath
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
      `public/profiles/user-${userId}`
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
  updateAnswer: async (questionId, answerId, data) => {
    return await api.put(`${API_ENDPOINTS.QNA.ANSWERS(questionId)}/${answerId}`, data);
  },

  // 답변 삭제 - 반환: null
  deleteAnswer: async (questionId, answerId) => {
    return await api.delete(`${API_ENDPOINTS.QNA.ANSWERS(questionId)}/${answerId}`);
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