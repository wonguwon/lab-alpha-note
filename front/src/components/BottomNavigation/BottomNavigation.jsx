import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoNotificationsOutline, IoLogOutOutline, IoPersonAddOutline, IoPersonOutline } from 'react-icons/io5';
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

  // 기본 프로필 이미지
  const defaultProfileImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuMjM4NiAyMCAyMCAyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTMwIDMyQzMwIDI3LjU4MTcgMjUuNTIyOCAyNCAyMCAyNEMxNC40NzcyIDI0IDEwIDI3LjU4MTcgMTAgMzJIMzBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';

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
            <ProfileImage
              src={user?.profileImageUrl || defaultProfileImage}
              alt="프로필"
              onError={(e) => {
                e.target.src = defaultProfileImage;
              }}
            />
          </AddButton>
        )}
      </NavList>
    </BottomNavContainer>
  );
};

export default BottomNavigation;