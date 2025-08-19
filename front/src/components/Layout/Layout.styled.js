import styled from 'styled-components';
import { flexColumn } from '../../styles/mixins';

/* 전체 레이아웃 컨테이너 */
export const LayoutContainer = styled.div`
  ${flexColumn}
  min-height: 100vh;
`;

/* 메인 콘텐츠 영역 */
export const MainContent = styled.main`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-bottom: 60px; /* 하단 네비게이션 높이만큼 여백 추가 */
  }
`;