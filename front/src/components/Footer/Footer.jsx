import React from 'react';
import {
  FooterContainer,
  FooterContent,
  FooterTop,
  FooterLogo,
  FooterLink,
  FooterBottom,
  CompanyInfo,
  Copyright,
  NavLinks,
  Separator
} from './Footer.styled';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterTop>
          {/* 로고 */}
          <FooterLogo>
            <img src="/logo.png" alt="AlphaNote" style={{ height: '110px' }} />
          </FooterLogo>

          {/* 네비게이션 링크들 */}
          <NavLinks>
            <FooterLink href="/privacy-policy">개인정보처리방침</FooterLink>
            <Separator>|</Separator>
            <FooterLink href="/terms">이용약관</FooterLink>
            <Separator>|</Separator>
            <FooterLink href="/contact">문의하기</FooterLink>
          </NavLinks>
        </FooterTop>

        <FooterBottom>
          {/* 회사 정보 */}
          <CompanyInfo>
            <div>상호명: 알파노트 | 대표명: 최지원</div>
            {/* <div>사업자등록번호:  | 통신판매업신고번호: 제~호 | 직업정보 제공사업 신고번호: </div> */}
            {/* <div>주소:  | 고객센터 :  </div> */}
          </CompanyInfo>

          {/* 저작권 정보 */}
          <Copyright>
            © 2025 AlphaNote. All rights reserved.
          </Copyright>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;