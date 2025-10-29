import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoNotificationsOutline, IoLogOutOutline, IoPersonAddOutline, IoPersonOutline, IoPersonCircle } from 'react-icons/io5';
import useAuthStore from '../../store/authStore';
import {
  BottomNavContainer,
  NavList,
  NavItem,
  NavIcon,
  NavLabel,
  AddButton,
  ProfileImage,
  Spacer,
  IconButton
} from './BottomNavigation.styled';

const BottomNavigation = ({ activeTab = 'qa', onTabChange }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleTabClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleNotificationClick = () => {
    // TODO: 알림 페이지 또는 모달 구현
    console.log('알림 클릭');
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <BottomNavContainer>
      <NavList>
        {/* Q&A 탭 */}
        <NavItem
          className={activeTab === 'qa' ? 'active' : ''}
          onClick={() => handleTabClick('qa')}
        >
          <NavIcon>💬</NavIcon>
          <NavLabel>Q&A</NavLabel>
        </NavItem>

        {/* 커뮤니티 탭 */}
        <NavItem
          className={activeTab === 'community' ? 'active' : ''}
          onClick={() => handleTabClick('community')}
        >
          <NavIcon>👥</NavIcon>
          <NavLabel>커뮤니티</NavLabel>
        </NavItem>

        {/* 중앙 공간 */}
        <Spacer />

        {/* 알림 버튼 */}
        {isAuthenticated ? (
          <IconButton onClick={handleNotificationClick}>
            <IoNotificationsOutline />
            <NavLabel>알림</NavLabel>
          </IconButton>
        ) : (
          <IconButton onClick={handleLoginClick}>
            <IoPersonOutline />
            <NavLabel>로그인</NavLabel>
          </IconButton>
        )}

        {/* 로그아웃 버튼 */}
        {isAuthenticated ? (
          <IconButton onClick={handleLogoutClick}>
            <IoLogOutOutline />
            <NavLabel>로그아웃</NavLabel>
          </IconButton>
        ) : (
          <IconButton onClick={handleSignupClick}>
            <IoPersonAddOutline />
            <NavLabel>가입</NavLabel>
          </IconButton>
        )}

        {/* 중앙 프로필 버튼 */}
        {isAuthenticated && (
          <AddButton onClick={handleProfileClick}>
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
              width: '50px',
              height: '50px',
              display: user?.profileImageUrl ? 'none' : 'block',
              color: '#6b7280'
            }} />
          </AddButton>
        )}
      </NavList>
    </BottomNavContainer>
  );
};

export default BottomNavigation;