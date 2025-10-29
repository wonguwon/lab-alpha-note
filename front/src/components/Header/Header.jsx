import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoNotificationsOutline, IoLogOutOutline, IoPersonCircle } from 'react-icons/io5';
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
  UserButton,
  ProfileButton,
  ProfileImage,
  IconButton
} from './Header.styled';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleNotificationClick = () => {
    // TODO: 알림 페이지 또는 모달 구현
    console.log('알림 클릭');
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
              <IconButton onClick={handleNotificationClick} title="알림">
                <IoNotificationsOutline />
              </IconButton>
              <IconButton onClick={handleLogout} title="로그아웃">
                <IoLogOutOutline />
              </IconButton>
              <ProfileButton onClick={handleProfileClick} title="프로필">
                {user?.profileImageUrl ? (
                  <ProfileImage
                    src={user.profileImageUrl}
                    alt="프로필"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <IoPersonCircle style={{
                  width: '32px',
                  height: '32px',
                  display: user?.profileImageUrl ? 'none' : 'block',
                  color: '#6b7280'
                }} />
              </ProfileButton>
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