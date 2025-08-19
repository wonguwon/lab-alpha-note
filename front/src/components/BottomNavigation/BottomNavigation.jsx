import React from 'react';
import {
  BottomNavContainer,
  NavList,
  NavItem,
  NavIcon,
  NavLabel,
  AddButton,
  Spacer
} from './BottomNavigation.styled';

const BottomNavigation = ({ activeTab = 'qa', onTabChange, onAddClick }) => {
  const handleTabClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    }
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

        {/* 기록 탭 */}
        <NavItem 
          className={activeTab === 'records' ? 'active' : ''}
          onClick={() => handleTabClick('records')}
        >
          <NavIcon>📝</NavIcon>
          <NavLabel>기록</NavLabel>
        </NavItem>

        {/* 내 정보 탭 */}
        <NavItem 
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => handleTabClick('profile')}
        >
          <NavIcon>👤</NavIcon>
          <NavLabel>내정보</NavLabel>
        </NavItem>

        {/* 중앙 추가 버튼 */}
        <AddButton onClick={handleAddClick}>
          +
        </AddButton>
      </NavList>
    </BottomNavContainer>
  );
};

export default BottomNavigation;