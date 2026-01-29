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
  min-height: 35vh;
  background: linear-gradient(135deg,
    ${props => props.theme.colors.primary[50]} 0%,
    ${props => props.theme.colors.primary[100]} 100%
  );
  text-align: center;
  padding: ${props => props.theme.spacing[12]} 0;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    min-height: 40vh;
    padding: ${props => props.theme.spacing[8]} 0;
  }
`;

/* 히어로 제목 */
export const HeroTitle = styled.h1`
  font-size: ${props => props.theme.fonts.size['4xl']};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing[4]};
  line-height: ${props => props.theme.fonts.lineHeight.tight};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fonts.size['2xl']};
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

/* 미리보기 그리드 */
export const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[12]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
`;

/* 미리보기 섹션 */
export const PreviewSection = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[6]};
  box-shadow: ${props => props.theme.shadows.sm};
`;

/* 미리보기 헤더 */
export const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing[4]};
`;

export const PreviewTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.xl};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0;
`;

export const ViewAllButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.primary[600]};
  font-weight: ${props => props.theme.fonts.weight.medium};
  font-size: ${props => props.theme.fonts.size.sm};
  cursor: pointer;
  transition: color ${props => props.theme.transitions.base};

  &:hover {
    color: ${props => props.theme.colors.primary[700]};
  }
`;

/* 질문/습관 리스트 */
export const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[3]};
`;

export const HabitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[3]};
`;

/* 미리보기 카드 */
export const QuestionPreviewCard = styled.div`
  padding: ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.gray[50]};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.white};
    border-color: ${props => props.theme.colors.primary[300]};
    transform: translateX(4px);
  }
`;

export const HabitPreviewCard = styled.div`
  padding: ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.gray[50]};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.white};
    border-color: ${props => props.theme.colors.primary[300]};
    transform: translateX(4px);
  }
`;

/* 카드 내부 요소 */
export const CardTitle = styled.h4`
  font-size: ${props => props.theme.fonts.size.base};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0 0 ${props => props.theme.spacing[2]} 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardMeta = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[3]};
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[500]};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

export const MetaItem = styled.span`
  &:not(:last-child)::after {
    content: '•';
    margin-left: ${props => props.theme.spacing[3]};
    color: ${props => props.theme.colors.gray[400]};
  }
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[2]};
`;

export const Tag = styled.span`
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  background: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[700]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: ${props => props.theme.fonts.weight.medium};
`;

/* 습관 카드 헤더 */
export const HabitCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

export const HabitColorBar = styled.div`
  width: 4px;
  height: 20px;
  background: ${props => props.$color || props.theme.colors.primary[500]};
  border-radius: ${props => props.theme.borderRadius.full};
  flex-shrink: 0;
`;

export const StreakBadge = styled.div`
  margin-left: auto;
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[800]};
  white-space: nowrap;
`;

/* 기능 그리드 */
export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing[8]};
  margin-top: ${props => props.theme.spacing[12]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
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
