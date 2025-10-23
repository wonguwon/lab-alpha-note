import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import {
  HeaderWrapper,
  HeaderContainer,
  LogoSection,
  LogoText,
  CenterSection,
  Navigation,
  NavLink,
  UserSection,
  UserButton
} from './Header.styled';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <HeaderWrapper>
      {/* 메인 헤더 */}
      <HeaderContainer>
        {/* 로고 영역 */}
        <LogoSection>
          <LogoText as={Link} to="/">AlphaNote</LogoText>
        </LogoSection>

        {/* 중앙 영역 (네비게이션) */}
        <CenterSection>
          {/* 내비게이션 영역 */}
          <Navigation>
            <NavLink href="/">Q&A</NavLink>
            <NavLink href="/community">커뮤니티</NavLink>
            <NavLink href="/records">기록</NavLink>
          </Navigation>
        </CenterSection>

        {/* 사용자 영역 */}
        <UserSection>
          {isAuthenticated ? (
            <>
              <UserButton as={Link} to="/profile">
                {user?.name || user?.email || '프로필'}
              </UserButton>
              <UserButton onClick={handleLogout}>로그아웃</UserButton>
            </>
          ) : (
            <>
              <UserButton as={Link} to="/login">로그인</UserButton>
              <UserButton as={Link} to="/signup" className="primary">회원가입</UserButton>
            </>
          )}
        </UserSection>
      </HeaderContainer>

    </HeaderWrapper>
  );
};

export default Header;