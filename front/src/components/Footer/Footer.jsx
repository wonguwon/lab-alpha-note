import React from 'react';
import {
  FooterContainer,
  FooterContent,
  FooterTop,
  FooterLogo,
  FooterLogoText,
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
            <FooterLogoText>Alpha Note</FooterLogoText>
          </FooterLogo>

          {/* 네비게이션 링크들 */}
          <NavLinks>
            <FooterLink href="/privacy">개인정보처리방침</FooterLink>
            <Separator>|</Separator>
            <FooterLink href="/terms">이용약관</FooterLink>
            <Separator>|</Separator>
            <FooterLink href="/contact">협업문의</FooterLink>
          </NavLinks>
        </FooterTop>

        <FooterBottom>
          {/* 회사 정보 */}
          <CompanyInfo>
            <div>상호명: (주)오키코리아 | 대표명: 노상범</div>
            <div>사업자등록번호: 592-87-02037 | 통신판매업신고번호: 제 2022-서울강남-04742호 | 직업정보 제공사업 신고번호: J1200020230009</div>
            <div>주소: 서울 강남구 봉은사로 303 TGL경복빌딩 502호 (06103) | 고객센터 : info@okky.kr (영업시간 평일 10:00~17:00) 주말 · 공휴일 휴무</div>
          </CompanyInfo>

          {/* 저작권 정보 */}
          <Copyright>
            © 2025 (주)오키코리아. All rights reserved.
          </Copyright>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;