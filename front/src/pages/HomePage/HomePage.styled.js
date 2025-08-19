import styled from 'styled-components';
import { flexColumn, flexCenter, container } from '../../styles/mixins';

/* 홈페이지 메인 컨테이너 */
export const HomeContainer = styled.div`
  ${flexColumn}
  width: 100%;
`;

/* 히어로 섹션 */
export const HeroSection = styled.section`
  ${flexCenter}
  ${flexColumn}
  min-height: 60vh;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary[50]} 0%, 
    ${props => props.theme.colors.primary[100]} 100%
  );
  text-align: center;
  padding: ${props => props.theme.spacing[16]} 0;
`;

/* 히어로 제목 */
export const HeroTitle = styled.h1`
  font-size: ${props => props.theme.fonts.size['5xl']};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing[6]};
  line-height: ${props => props.theme.fonts.lineHeight.tight};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fonts.size['3xl']};
  }
`;

/* 히어로 설명 */
export const HeroDescription = styled.p`
  font-size: ${props => props.theme.fonts.size.xl};
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: ${props => props.theme.spacing[10]};
  max-width: 600px;
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fonts.size.lg};
    margin-bottom: ${props => props.theme.spacing[8]};
  }
`;

/* CTA 버튼들 */
export const CTAButtons = styled.div`
  ${flexCenter}
  gap: ${props => props.theme.spacing[4]};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
    
    > * {
      width: 100%;
      max-width: 280px;
    }
  }
`;

/* 기본 버튼 스타일 (임시) */
export const Button = styled.button`
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[8]};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  font-size: ${props => props.theme.fonts.size.base};
  transition: all ${props => props.theme.transitions.base};
  cursor: pointer;
  border: none;
  
  &.primary {
    background: ${props => props.theme.colors.primary[600]};
    color: ${props => props.theme.colors.white};
    
    &:hover {
      background: ${props => props.theme.colors.primary[700]};
      transform: translateY(-1px);
    }
  }
  
  &.secondary {
    background: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.primary[600]};
    border: 2px solid ${props => props.theme.colors.primary[600]};
    
    &:hover {
      background: ${props => props.theme.colors.primary[50]};
    }
  }
`;

/* 콘텐츠 섹션 */
export const ContentSection = styled.section`
  ${container}
  padding: ${props => props.theme.spacing[16]} ${props => props.theme.spacing[6]};
`;

/* 섹션 제목 */
export const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fonts.size['3xl']};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[12]};
`;

/* 기능 그리드 */
export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing[8]};
  margin-top: ${props => props.theme.spacing[12]};
`;

/* 기능 카드 */
export const FeatureCard = styled.div`
  ${flexColumn}
  align-items: center;
  text-align: center;
  padding: ${props => props.theme.spacing[8]};
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

/* 기능 아이콘 */
export const FeatureIcon = styled.div`
  font-size: ${props => props.theme.fonts.size['4xl']};
  margin-bottom: ${props => props.theme.spacing[4]};
`;

/* 기능 제목 */
export const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.xl};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing[3]};
`;

/* 기능 설명 */
export const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
`;