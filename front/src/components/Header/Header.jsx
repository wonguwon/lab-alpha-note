import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoNotificationsOutline, IoLogOutOutline, IoPersonCircle, IoMenu, IoClose } from 'react-icons/io5';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';
import { authService } from '../../api/services';
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
  NotificationBadge,
  MobileMenuButton,
  MobileMenu,
  MobileNavLink,
  MobileUserSection
} from './Header.styled';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { unreadCount, fetchUnreadCount } = useNotificationStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 알림 개수 조회 (로그인 상태일 때만)
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    }
  }, [isAuthenticated, fetchUnreadCount]);

  const handleLogout = async () => {
    try {
      // 백엔드에서 쿠키 삭제
      await authService.logout();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      // 프론트엔드 상태 초기화
      logout();
      navigate('/');
      setIsMobileMenuOpen(false);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsMobileMenuOpen(false);
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
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
            <NavLink
              as={Link}
              to="/growth-logs"
              className={location.pathname.startsWith('/growth-logs') ? 'active' : ''}
            >
              Growth
            </NavLink>
            <NavLink
              as={Link}
              to="/goals"
              className={location.pathname.startsWith('/goals') ? 'active' : ''}
            >
              Goal
            </NavLink>
          </Navigation>
        </CenterSection>

        {/* 사용자 영역 - 데스크톱에서만 표시 */}
        <UserSection>
          {isAuthenticated ? (
            <>
              <IconButton onClick={handleNotificationClick} title="알림">
                <IoNotificationsOutline />
                {unreadCount > 0 && <NotificationBadge>{unreadCount > 99 ? '99+' : unreadCount}</NotificationBadge>}
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
        <MobileNavLink
          as={Link}
          to="/growth-logs"
          onClick={handleNavLinkClick}
          className={location.pathname.startsWith('/growth-logs') ? 'active' : ''}
        >
          Growth
        </MobileNavLink>
        <MobileNavLink
          as={Link}
          to="/goals"
          onClick={handleNavLinkClick}
          className={location.pathname.startsWith('/goals') ? 'active' : ''}
        >
          Goal
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