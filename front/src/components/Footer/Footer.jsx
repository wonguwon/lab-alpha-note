import React from 'react';
import {
  FooterContainer,
  FooterContent,
  FooterTop,
  FooterLogo,
  FooterLogoText,
  FooterDescription,
  FooterLinks,
  FooterSection,
  FooterSectionTitle,
  FooterLink,
  FooterBottom,
  Copyright,
  SocialLinks,
  SocialLink
} from './Footer.styled';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterTop>
          {/* 로고 및 설명 */}
          <FooterLogo>
            <FooterLogoText>Alpha Note</FooterLogoText>
            <FooterDescription>
              혁신적인 노트 앱으로 당신의 아이디어를 체계적으로 관리하고 
              창의적인 작업을 더욱 효율적으로 만들어보세요.
            </FooterDescription>
          </FooterLogo>

          {/* 링크 섹션들 */}
          <FooterLinks>
            <FooterSection>
              <FooterSectionTitle>제품</FooterSectionTitle>
              <FooterLink href="/features">기능</FooterLink>
              <FooterLink href="/pricing">가격</FooterLink>
              <FooterLink href="/updates">업데이트</FooterLink>
              <FooterLink href="/download">다운로드</FooterLink>
            </FooterSection>

            <FooterSection>
              <FooterSectionTitle>회사</FooterSectionTitle>
              <FooterLink href="/about">회사소개</FooterLink>
              <FooterLink href="/careers">채용</FooterLink>
              <FooterLink href="/blog">블로그</FooterLink>
              <FooterLink href="/contact">연락처</FooterLink>
            </FooterSection>

            <FooterSection>
              <FooterSectionTitle>지원</FooterSectionTitle>
              <FooterLink href="/help">도움말</FooterLink>
              <FooterLink href="/faq">자주 묻는 질문</FooterLink>
              <FooterLink href="/community">커뮤니티</FooterLink>
              <FooterLink href="/feedback">피드백</FooterLink>
            </FooterSection>
          </FooterLinks>
        </FooterTop>

        <FooterBottom>
          {/* 저작권 정보 */}
          <Copyright>
            © {currentYear} Alpha Note. All rights reserved.
          </Copyright>

          {/* 소셜 미디어 링크 */}
          <SocialLinks>
            <SocialLink href="#" aria-label="Facebook">
              📘
            </SocialLink>
            <SocialLink href="#" aria-label="Twitter">
              🐦
            </SocialLink>
            <SocialLink href="#" aria-label="Instagram">
              📷
            </SocialLink>
            <SocialLink href="#" aria-label="GitHub">
              💻
            </SocialLink>
          </SocialLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;