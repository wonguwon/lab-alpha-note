/**
 * 이미지 URL을 처리하는 헬퍼 함수
 * - 구글 로그인: http(s)로 시작하는 외부 URL을 그대로 사용
 * - 내부 서버: /로 시작하는 상대 경로를 API 서버 URL과 결합
 *
 * @param {string} imgUrl - 이미지 URL (절대 URL 또는 상대 경로)
 * @returns {string} - 완전한 이미지 URL
 */
export const getImageUrl = (imgUrl) => {
  if (!imgUrl) return null;

  // 절대 URL (http://, https://)이면 그대로 사용
  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
    return imgUrl;
  }

  // 상대 경로면 API 서버 URL 붙이기
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
  return `${apiUrl}${imgUrl}`;
};
