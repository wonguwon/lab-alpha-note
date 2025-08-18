import React from 'react';
import { FiSearch, FiBell, FiUser } from 'react-icons/fi';
import Button from '../Button';
import * as S from './Header.styled';

function Header() {
  return (
    <S.HeaderContainer>
      <S.HeaderContent>
        <S.Logo to="/">
          Alpha<S.LogoAccent>Note</S.LogoAccent>
        </S.Logo>
        
        <S.Nav>
          <S.NavItem to="/questions">질문</S.NavItem>
          <S.NavItem to="/community">커뮤니티</S.NavItem>
          <S.NavItem to="/knowledge">지식</S.NavItem>
          <S.NavItem to="/notice">공지사항</S.NavItem>
        </S.Nav>
        
        <S.SearchContainer>
          <FiSearch size={16} color="#9ca3af" />
          <S.SearchInput placeholder="검색어를 입력하세요..." />
        </S.SearchContainer>
        
        <S.UserActions>
          <S.IconButton>
            <FiBell size={20} />
          </S.IconButton>
          <S.IconButton>
            <FiUser size={20} />
          </S.IconButton>
          <Button size="small">로그인</Button>
        </S.UserActions>
      </S.HeaderContent>
    </S.HeaderContainer>
  );
}

export default Header;