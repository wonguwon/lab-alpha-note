import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { LayoutContainer, MainContent } from './Layout.styled';

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        {children}
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;