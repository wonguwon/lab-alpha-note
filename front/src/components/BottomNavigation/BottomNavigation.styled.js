import styled from 'styled-components';
import { flexCenter, flexBetween } from '../../styles/mixins';

/* 하단 네비게이션 컨테이너 */
export const BottomNavContainer = styled.nav`
  display: none;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: ${props => props.theme.colors.white};
    border-top: 1px solid ${props => props.theme.colors.gray[200]};
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: ${props => props.theme.zIndex.fixed};
    height: 60px;
    padding-bottom: env(safe-area-inset-bottom); /* iOS safe area */
  }
`;

/* 네비게이션 메뉴 리스트 */
export const NavList = styled.div`
  ${flexBetween}
  height: 60px;
  padding: 0 ${props => props.theme.spacing[2]};
  position: relative;
`;

/* 네비게이션 아이템 */
export const NavItem = styled.button`
  ${flexCenter}
  flex-direction: column;
  flex: 1;
  height: 100%;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  padding: ${props => props.theme.spacing[1]};
  
  &:hover {
    background: ${props => props.theme.colors.gray[50]};
  }
  
  &.active {
    color: ${props => props.theme.colors.primary[600]};
  }
`;

/* 네비 아이콘 */
export const NavIcon = styled.div`
  font-size: ${props => props.theme.fonts.size.lg};
  margin-bottom: ${props => props.theme.spacing[1]};
  color: inherit;
`;

/* 네비 라벨 */
export const NavLabel = styled.span`
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: ${props => props.theme.fonts.weight.medium};
  color: ${props => props.theme.colors.gray[600]};
  
  .active & {
    color: ${props => props.theme.colors.primary[600]};
    font-weight: ${props => props.theme.fonts.weight.semibold};
  }
`;

/* 중앙 추가 버튼 */
export const AddButton = styled.button`
  ${flexCenter}
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background: ${props => props.theme.colors.primary[600]};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: 50%;
  font-size: ${props => props.theme.fonts.size.xl};
  box-shadow: ${props => props.theme.shadows.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  z-index: 1;
  
  &:hover {
    background: ${props => props.theme.colors.primary[700]};
    transform: translate(-50%, -50%) scale(1.05);
  }
  
  &:active {
    transform: translate(-50%, -50%) scale(0.95);
  }
`;

/* 스페이서 (중앙 버튼 공간 확보) */
export const Spacer = styled.div`
  flex: 1;
`;