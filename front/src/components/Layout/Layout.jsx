import React, { useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import BottomNavigation from '../BottomNavigation';
import { LayoutContainer, MainContent } from './Layout.styled';

const Layout = ({ children }) => {
  const [activeTab, setActiveTab] = useState('qa');

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    console.log('탭 변경:', tabId);
    // 실제 라우팅 로직 구현
  };

  const handleAddClick = () => {
    console.log('새 글 작성');
    // 새 글 작성 모달이나 페이지로 이동
  };

  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        {children}
      </MainContent>
      <Footer />
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAddClick={handleAddClick}
      />
    </LayoutContainer>
  );
};

export default Layout;