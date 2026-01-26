import { css } from 'styled-components';

// Flexbox 레이아웃 믹스인
/* 요소를 수평/수직 중앙 정렬 */
export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* 요소들을 양 끝으로 배치하고 세로 중앙 정렬 */
export const flexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/* 세로 방향으로 요소 배치 */
export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

/* 세로 방향으로 요소를 배치하고 중앙 정렬 */
export const flexColumnCenter = css`
  ${flexColumn}
  align-items: center;
  justify-content: center;
`;

// 텍스트 스타일링 믹스인
/* 텍스트가 길면 말줄임표(...) 처리 */
export const truncate = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* 지정한 줄 수를 넘으면 말줄임표 처리 */
export const lineClamp = (lines) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// 카드 컴포넌트 믹스인
/* 기본 카드 스타일 (테두리, 그림자, 둥근 모서리) */
export const card = css`
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.sm};
`;

/* 호버 효과가 있는 카드 (마우스 올리면 떠오르는 효과) */
export const cardHover = css`
  ${card}
  transition: all ${props => props.theme.transitions.base};
  cursor: pointer;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-1px);
  }
`;

// 버튼 컴포넌트 믹스인
/* 모든 버튼의 기본 스타일 */
export const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fonts.weight.medium};
  transition: all ${props => props.theme.transitions.base};
  cursor: pointer;
  border: none;
  text-decoration: none;
  white-space: nowrap;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* 주요 동작용 버튼 (파란색 배경) */
export const buttonPrimary = css`
  ${buttonBase}
  background: ${props => props.theme.colors.primary[500]};
  color: ${props => props.theme.colors.white};
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary[600]};
  }
  
  &:active:not(:disabled) {
    background: ${props => props.theme.colors.primary[700]};
  }
`;

/* 보조 동작용 버튼 (회색 배경) */
export const buttonSecondary = css`
  ${buttonBase}
  background: ${props => props.theme.colors.gray[100]};
  color: ${props => props.theme.colors.gray[700]};
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.gray[200]};
  }
  
  &:active:not(:disabled) {
    background: ${props => props.theme.colors.gray[300]};
  }
`;

/* 테두리만 있는 버튼 (배경 투명) */
export const buttonOutline = css`
  ${buttonBase}
  background: transparent;
  color: ${props => props.theme.colors.primary[600]};
  border: 1px solid ${props => props.theme.colors.primary[300]};
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary[50]};
    border-color: ${props => props.theme.colors.primary[400]};
  }
  
  &:active:not(:disabled) {
    background: ${props => props.theme.colors.primary[100]};
  }
`;

// 입력 필드 믹스인
/* 텍스트 입력 필드의 기본 스타일 */
export const inputBase = css`
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.gray[900]};
  font-size: ${props => props.theme.fonts.size.base};
  transition: all ${props => props.theme.transitions.base};
  
  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
  
  &:disabled {
    background: ${props => props.theme.colors.gray[50]};
    color: ${props => props.theme.colors.gray[500]};
    cursor: not-allowed;
  }
`;


// 애니메이션 믹스인
/* 페이드 인 애니메이션 (서서히 나타남) */
export const fadeIn = css`
  animation: fadeIn ${props => props.theme.transitions.base};
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

/* 아래에서 위로 슬라이드 애니메이션 */
export const slideUp = css`
  animation: slideUp ${props => props.theme.transitions.base};
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// 레이아웃 믹스인
/* 컨테이너 래퍼 (최대 너비 제한, 중앙 정렬) */
export const container = css`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[5]};

  /* 중간 화면 (1440px 이상) */
  @media (min-width: 1440px) {
    max-width: 1376px;
  }

  /* 큰 화면 (1920px 이상) */
  @media (min-width: 1920px) {
    max-width: 1728px;
  }
`;

/* 스크린 리더 전용 텍스트 (화면에는 숨김) */
export const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// 로딩 스켈레톤 믹스인
/* 콘텐츠 로딩 중 보여줄 스켈레톤 애니메이션 */
export const skeleton = css`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.gray[200]} 25%,
    ${props => props.theme.colors.gray[100]} 50%,
    ${props => props.theme.colors.gray[200]} 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;