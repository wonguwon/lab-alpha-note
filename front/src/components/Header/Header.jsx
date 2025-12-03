import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoNotificationsOutline, IoLogOutOutline, IoPersonCircle, IoMenu, IoClose } from 'react-icons/io5';
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
  IconButton,
  MobileMenuButton,
  MobileMenu,
  MobileNavLink,
  MobileUserSection
} from './Header.styled';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsMobileMenuOpen(false);
  };

  const handleNotificationClick = () => {
    // TODO: 알림 페이지 또는 모달 구현
    console.log('알림 클릭');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <HeaderWrapper>
      {/* 메인 헤더 */}
      <HeaderContainer>
        {/* 로고 영역 */}
        <LogoSection as={Link} to="/" onClick={handleNavLinkClick}>
          <img src="/logo.png" alt="AlphaNote" style={{ height: '56px' }} />
        </LogoSection>

        {/* 중앙 영역 (네비게이션) - 데스크톱에서만 표시 */}
        <CenterSection>
          <Navigation>
            <NavLink
              as={Link}
              to="/qna"
              className={location.pathname.startsWith('/qna') ? 'active' : ''}
            >
              Q&A
            </NavLink>
            <NavLink
              as={Link}
              to="/habits"
              className={location.pathname.startsWith('/habit') ? 'active' : ''}
            >
              Habit
            </NavLink>
          </Navigation>
        </CenterSection>

        {/* 사용자 영역 - 데스크톱에서만 표시 */}
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

        {/* 모바일 햄버거 버튼 */}
        <MobileMenuButton onClick={toggleMobileMenu} aria-label="메뉴">
          {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
        </MobileMenuButton>
      </HeaderContainer>

      {/* 모바일 메뉴 */}
      <MobileMenu $isOpen={isMobileMenuOpen}>
        <MobileNavLink
          as={Link}
          to="/qna"
          onClick={handleNavLinkClick}
          className={location.pathname.startsWith('/qna') ? 'active' : ''}
        >
          Q&A
        </MobileNavLink>
        <MobileNavLink
          as={Link}
          to="/habits"
          onClick={handleNavLinkClick}
          className={location.pathname.startsWith('/habit') ? 'active' : ''}
        >
          Habit
        </MobileNavLink>

        <MobileUserSection>
          {isAuthenticated ? (
            <>
              <MobileNavLink onClick={handleNotificationClick}>
                <IoNotificationsOutline style={{ marginRight: '8px' }} />
                알림
              </MobileNavLink>
              <MobileNavLink onClick={handleProfileClick}>
                <IoPersonCircle style={{ marginRight: '8px' }} />
                프로필
              </MobileNavLink>
              <MobileNavLink onClick={handleLogout}>
                <IoLogOutOutline style={{ marginRight: '8px' }} />
                로그아웃
              </MobileNavLink>
            </>
          ) : (
            <>
              <MobileNavLink as={Link} to="/login" onClick={handleNavLinkClick}>
                로그인
              </MobileNavLink>
              <MobileNavLink as={Link} to="/signup" onClick={handleNavLinkClick} className="primary">
                회원가입
              </MobileNavLink>
            </>
          )}
        </MobileUserSection>
      </MobileMenu>
    </HeaderWrapper>
  );
};

export default Header;