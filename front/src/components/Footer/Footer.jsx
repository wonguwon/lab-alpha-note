import React from 'react';
import { FiGithub, FiTwitter, FiMail, FiHeart } from 'react-icons/fi';
import * as S from './Footer.styled';

function Footer() {
  return (
    <S.FooterContainer>
      <S.FooterContent>
        <S.FooterGrid>
          <S.FooterSection>
            <S.SectionTitle>AlphaNote</S.SectionTitle>
            <S.Description>
              개발자들을 위한 지식 공유 커뮤니티입니다. 
              질문하고, 답변하고, 함께 성장해요.
            </S.Description>
            <S.SocialLinks>
              <S.SocialButton href="#" aria-label="GitHub">
                <FiGithub size={20} />
              </S.SocialButton>
              <S.SocialButton href="#" aria-label="Twitter">
                <FiTwitter size={20} />
              </S.SocialButton>
              <S.SocialButton href="#" aria-label="Email">
                <FiMail size={20} />
              </S.SocialButton>
            </S.SocialLinks>
          </S.FooterSection>

          <S.FooterSection>
            <S.SectionTitle>커뮤니티</S.SectionTitle>
            <S.LinkList>
              <li><S.FooterLink href="#questions">질문 & 답변</S.FooterLink></li>
              <li><S.FooterLink href="#community">커뮤니티</S.FooterLink></li>
              <li><S.FooterLink href="#knowledge">지식</S.FooterLink></li>
              <li><S.FooterLink href="#notice">공지사항</S.FooterLink></li>
              <li><S.FooterLink href="#tags">태그</S.FooterLink></li>
            </S.LinkList>
          </S.FooterSection>

          <S.FooterSection>
            <S.SectionTitle>정보</S.SectionTitle>
            <S.LinkList>
              <li><S.FooterLink href="#about">소개</S.FooterLink></li>
              <li><S.FooterLink href="#rules">이용약관</S.FooterLink></li>
              <li><S.FooterLink href="#privacy">개인정보처리방침</S.FooterLink></li>
              <li><S.FooterLink href="#contact">문의하기</S.FooterLink></li>
              <li><S.FooterLink href="#api">API</S.FooterLink></li>
            </S.LinkList>
          </S.FooterSection>

          <S.FooterSection>
            <S.SectionTitle>도움말</S.SectionTitle>
            <S.LinkList>
              <li><S.FooterLink href="#help">도움말 센터</S.FooterLink></li>
              <li><S.FooterLink href="#guide">사용 가이드</S.FooterLink></li>
              <li><S.FooterLink href="#markdown">마크다운 가이드</S.FooterLink></li>
              <li><S.FooterLink href="#faq">자주 묻는 질문</S.FooterLink></li>
              <li><S.FooterLink href="#report">신고하기</S.FooterLink></li>
            </S.LinkList>
          </S.FooterSection>
        </S.FooterGrid>

        <S.FooterBottom>
          <S.Copyright>
            © 2024 AlphaNote. Made with <FiHeart size={16} color="#ef4444" /> by developers.
          </S.Copyright>
          <S.BottomLinks>
            <S.FooterLink href="#terms">이용약관</S.FooterLink>
            <S.FooterLink href="#privacy">개인정보보호</S.FooterLink>
            <S.FooterLink href="#cookies">쿠키 정책</S.FooterLink>
          </S.BottomLinks>
        </S.FooterBottom>
      </S.FooterContent>
    </S.FooterContainer>
  );
}

export default Footer;