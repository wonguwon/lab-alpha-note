import React from 'react';
import {
  HeaderWrapper,
  HeaderContainer,
  LogoSection,
  LogoText,
  CenterSection,
  Navigation,
  NavLink,
  UserSection,
  UserButton
} from './Header.styled';

const Header = () => {

  return (
    <HeaderWrapper>
      {/* 메인 헤더 */}
      <HeaderContainer>
        {/* 로고 영역 */}
        <LogoSection>
          <LogoText>AlphaNote</LogoText>
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
          <UserButton>로그인</UserButton>
          <UserButton className="primary">회원가입</UserButton>
        </UserSection>
      </HeaderContainer>

    </HeaderWrapper>
  );
};

export default Header;