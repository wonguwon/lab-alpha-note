import { authService } from './services';

/**
 * /auth/me 요청을 retry 로직과 함께 실행
 * 로그인/회원가입 직후 쿠키 설정 대기를 위한 함수
 * 
 * @param {number} maxRetries - 최대 재시도 횟수 (기본값: 5)
 * @param {number} delay - 재시도 간격 (ms, 기본값: 500)
 * @returns {Promise} 사용자 정보
 */
export async function getMeWithRetry(maxRetries = 5, delay = 500) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await authService.getUserInfo();
    } catch (error) {
      const isLast = i === maxRetries - 1;
      
      // 401이 아니거나 마지막 시도면 에러 throw
      if (error.response?.status !== 401 || isLast) {
        throw error;
      }
      
      // 401이고 마지막 시도가 아니면 대기 후 재시도
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

