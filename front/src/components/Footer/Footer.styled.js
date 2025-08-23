import styled from 'styled-components';
import { flexBetween, flexCenter, flexColumn } from '../../styles/mixins';

/* 푸터 메인 컨테이너 */
export const FooterContainer = styled.footer`
  background: ${props => props.theme.colors.gray[50]};
  color: ${props => props.theme.colors.gray[700]};
  padding: ${props => props.theme.spacing[6]} 0 ${props => props.theme.spacing[6]};
  margin-top: auto;
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
`;

/* 푸터 내용 래퍼 */
export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[6]};
`;

/* 푸터 상단 영역 - 네비게이션 */
export const FooterTop = styled.div`
  ${flexColumn}
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[8]};
`;

/* 푸터 로고 영역 */
export const FooterLogo = styled.div`
  ${flexColumn}
  align-items: flex-start;
`;

/* 푸터 로고 텍스트 */
export const FooterLogoText = styled.h3`
  color: ${props => props.theme.colors.gray[900]};
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: ${props => props.theme.fonts.weight.bold};
  margin: 0;
`;

/* 푸터 설명 */
export const FooterDescription = styled.p`
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fonts.size.sm};
  margin: 0;
  max-width: 300px;
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
`;

/* 푸터 링크 섹션들 */
export const FooterLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing[8]};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${props => props.theme.spacing[6]};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

/* 개별 링크 섹션 */
export const FooterSection = styled.div`
  ${flexColumn}
  align-items: flex-start;
`;

/* 섹션 제목 */
export const FooterSectionTitle = styled.h4`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fonts.size.base};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
`;

/* 섹션 링크 */
export const FooterLink = styled.a`
  color: ${props => props.theme.colors.gray[600]};
  font-size: ${props => props.theme.fonts.size.sm};
  text-decoration: none;
  transition: color ${props => props.theme.transitions.base};
  
  &:hover {
    color: ${props => props.theme.colors.primary[600]};
  }
`;

/* 푸터 하단 영역 */
export const FooterBottom = styled.div`
  ${flexColumn}
  gap: ${props => props.theme.spacing[4]};
  align-items: center;
`;

/* 회사 정보 */
export const CompanyInfo = styled.div`
  ${flexColumn}
  gap: ${props => props.theme.spacing[2]};
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[500]};
  text-align: center;
  line-height: 1.5;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 10px;
    gap: ${props => props.theme.spacing[1]};
  }
`;

/* 저작권 정보 */
export const Copyright = styled.p`
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fonts.size.xs};
  margin: 0;
  text-align: center;
  font-weight: ${props => props.theme.fonts.weight.medium};
`;

/* 네비게이션 링크들 */
export const NavLinks = styled.div`
  ${flexCenter}
  gap: ${props => props.theme.spacing[1]};
  flex-wrap: wrap;
`;

/* 구분자 */
export const Separator = styled.span`
  color: ${props => props.theme.colors.gray[300]};
  margin: 0 ${props => props.theme.spacing[2]};
  user-select: none;
`;