import styled from 'styled-components';
import { flexBetween, flexCenter } from '../../styles/mixins';

/* 헤더 메인 컨테이너 */
export const HeaderContainer = styled.div`
  ${flexBetween}
  height: 60px;
  padding: 0 ${props => props.theme.spacing[4]};
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
`;

/* 로고 영역 */
export const LogoSection = styled.div`
  ${flexCenter}
  flex-shrink: 0;
  margin-right: ${props => props.theme.spacing[6]};
`;

/* 로고 텍스트 */
export const LogoText = styled.h1`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.primary[600]};
  margin: 0;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.primary[700]};
  }
`;

/* 중앙 영역 (네비게이션) */
export const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

/* 내비게이션 영역 */
export const Navigation = styled.nav`
  ${flexCenter}
  gap: ${props => props.theme.spacing[6]};
  flex-shrink: 0;
`;

/* 내비게이션 링크 */
export const NavLink = styled.a`
  color: ${props => props.theme.colors.gray[600]};
  font-weight: ${props => props.theme.fonts.weight.medium};
  font-size: ${props => props.theme.fonts.size.sm};
  text-decoration: none;
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  transition: color ${props => props.theme.transitions.base};
  white-space: nowrap;
  
  &:hover {
    color: ${props => props.theme.colors.primary[600]};
  }
  
  &.active {
    color: ${props => props.theme.colors.primary[600]};
    font-weight: ${props => props.theme.fonts.weight.semibold};
  }
`;


/* 사용자 영역 */
export const UserSection = styled.div`
  ${flexCenter}
  gap: ${props => props.theme.spacing[3]};
  flex-shrink: 0;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

/* 헤더 래퍼 (전체 너비 배경) */
export const HeaderWrapper = styled.header`
  width: 100%;
  background: ${props => props.theme.colors.white};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  position: sticky;
  top: 0;
  z-index: ${props => props.theme.zIndex.sticky};
`;



/* 사용자 버튼 스타일 */
export const UserButton = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.base};
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.gray[700]};
  font-weight: ${props => props.theme.fonts.weight.medium};
  font-size: ${props => props.theme.fonts.size.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  height: 36px;
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
    border-color: ${props => props.theme.colors.gray[400]};
  }

  &.primary {
    background: ${props => props.theme.colors.primary[600]};
    color: ${props => props.theme.colors.white};
    border-color: ${props => props.theme.colors.primary[600]};

    &:hover {
      background: ${props => props.theme.colors.primary[700]};
      border-color: ${props => props.theme.colors.primary[700]};
    }
  }
`;

/* 프로필 이미지 버튼 */
export const ProfileButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.colors.gray[200]};
  background: ${props => props.theme.colors.white};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  overflow: hidden;
  padding: 0;

  &:hover {
    border-color: ${props => props.theme.colors.primary[500]};
  }
`;

/* 프로필 이미지 */
export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

/* 아이콘 버튼 */
export const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.borderRadius.base};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.gray[600]};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
    border-color: ${props => props.theme.colors.gray[300]};
    color: ${props => props.theme.colors.gray[900]};
  }
`;

/* 알림 배지 */
export const NotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${props => props.theme.colors.danger[500]};
  color: ${props => props.theme.colors.white};
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  padding: 0 ${props => props.theme.spacing[1]};
  font-size: 10px;
  font-weight: ${props => props.theme.fonts.weight.bold};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${props => props.theme.colors.white};
`;

/* 모바일 햄버거 버튼 */
export const MobileMenuButton = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.gray[700]};
  cursor: pointer;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: flex;
  }
`;

/* 모바일 메뉴 */
export const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.white};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  padding: ${props => props.theme.spacing[4]};
  flex-direction: column;
  gap: ${props => props.theme.spacing[1]};
  max-height: calc(100vh - 60px);
  overflow-y: auto;
  z-index: ${props => props.theme.zIndex.dropdown || 100};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
  }
`;

/* 모바일 네비게이션 링크 */
export const MobileNavLink = styled.a`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing[3]};
  color: ${props => props.theme.colors.gray[700]};
  font-weight: ${props => props.theme.fonts.weight.medium};
  font-size: ${props => props.theme.fonts.size.base};
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.base};
  transition: all ${props => props.theme.transitions.base};
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
    color: ${props => props.theme.colors.primary[600]};
  }

  &.active {
    background: ${props => props.theme.colors.primary[50]};
    color: ${props => props.theme.colors.primary[600]};
    font-weight: ${props => props.theme.fonts.weight.semibold};
  }

  &.primary {
    background: ${props => props.theme.colors.primary[600]};
    color: ${props => props.theme.colors.white};
    margin-top: ${props => props.theme.spacing[2]};

    &:hover {
      background: ${props => props.theme.colors.primary[700]};
      color: ${props => props.theme.colors.white};
    }
  }
`;

/* 모바일 사용자 섹션 */
export const MobileUserSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[1]};
  margin-top: ${props => props.theme.spacing[3]};
  padding-top: ${props => props.theme.spacing[3]};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
`;