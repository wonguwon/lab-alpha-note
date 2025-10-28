import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoNotificationsOutline, IoLogOutOutline } from 'react-icons/io5';
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

  // 기본 프로필 이미지 (사람 모형 아이콘)
  const defaultProfileImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuMjM4NiAyMCAyMCAyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTMwIDMyQzMwIDI3LjU4MTcgMjUuNTIyOCAyNCAyMCAyNEMxNC40NzcyIDI0IDEwIDI3LjU4MTcgMTAgMzJIMzBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';

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
                <ProfileImage
                  src={user?.profileImageUrl || defaultProfileImage}
                  alt="프로필"
                  onError={(e) => {
                    e.target.src = defaultProfileImage;
                  }}
                />
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