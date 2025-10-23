import React, { useState } from 'react';
import {
  BottomNavContainer,
  NavList,
  NavItem,
  NavIcon,
  NavLabel,
  AddButton,
  Spacer,
  MenuButton,
  MenuOverlay,
  MenuContent,
  MenuCloseButton,
  MenuButtonItem
} from './BottomNavigation.styled';

const BottomNavigation = ({ activeTab = 'qa', onTabChange, onAddClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
  
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleMenuClose = () => {
    setIsMenuOpen(false);
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

        {/* 햄버거 메뉴 */}
        <MenuButton onClick={handleMenuToggle}>
          <NavIcon>☰</NavIcon>
          <NavLabel>더보기</NavLabel>
        </MenuButton>

        {/* 중앙 추가 버튼 */}
        <AddButton onClick={handleAddClick}>
          +
        </AddButton>
      </NavList>
      
      {/* 모바일 메뉴 오버레이 */}
      {isMenuOpen && (
        <MenuOverlay onClick={handleMenuClose}>
          <MenuContent onClick={(e) => e.stopPropagation()}>
            <MenuCloseButton onClick={handleMenuClose}>×</MenuCloseButton>
            <MenuButtonItem>로그인</MenuButtonItem>
            <MenuButtonItem className="primary">회원가입</MenuButtonItem>
          </MenuContent>
        </MenuOverlay>
      )}
    </BottomNavContainer>
  );
};

export default BottomNavigation;