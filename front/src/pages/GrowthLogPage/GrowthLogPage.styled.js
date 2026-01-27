import styled from 'styled-components';
import { container, flexBetween } from '../../styles/mixins';

export const GrowthLogContainer = styled.div`
  ${container}
  padding: ${props => props.theme.spacing[6]} ${props => props.theme.spacing[4]};
  max-width: 1200px;
  min-height: calc(100vh - 200px);
`;

export const GrowthLogHeader = styled.div`
  ${flexBetween}
  margin-bottom: ${props => props.theme.spacing[6]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing[4]};
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
    flex-direction: column;
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  background: ${props => props.theme.colors.gray[100]};
  padding: ${props => props.theme.spacing[1]};
  border-radius: ${props => props.theme.borderRadius.lg};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
  }
`;

export const ViewToggleButton = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  background: ${props => props.$active ? props.theme.colors.white : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.primary[600] : props.theme.colors.gray[600]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.base};
  font-weight: ${props => props.$active ? props.theme.fonts.weight.semibold : props.theme.fonts.weight.medium};
  font-size: ${props => props.theme.fonts.size.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  white-space: nowrap;
  box-shadow: ${props => props.$active ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'};

  &:hover {
    color: ${props => props.theme.colors.primary[600]};
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex: 1;
  }
`;

export const PageTitle = styled.h1`
  font-size: ${props => props.theme.fonts.size['3xl']};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0;
`;

export const CreateButton = styled.button`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.primary[600]};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  font-size: ${props => props.theme.fonts.size.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.colors.primary[700]};
    transform: translateY(-1px);
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
  }
`;

export const FilterSection = styled.div`
  ${flexBetween}
  margin-bottom: ${props => props.theme.spacing[6]};
  gap: ${props => props.theme.spacing[4]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FilterTabs = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  background: ${props => props.theme.colors.gray[100]};
  padding: ${props => props.theme.spacing[1]};
  border-radius: ${props => props.theme.borderRadius.lg};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
  }
`;

export const FilterTab = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  background: ${props => props.$active ? props.theme.colors.white : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.primary[600] : props.theme.colors.gray[600]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.base};
  font-weight: ${props => props.$active ? props.theme.fonts.weight.semibold : props.theme.fonts.weight.medium};
  font-size: ${props => props.theme.fonts.size.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  white-space: nowrap;
  box-shadow: ${props => props.$active ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'};

  &:hover {
    color: ${props => props.theme.colors.primary[600]};
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex: 1;
  }
`;

export const SearchBox = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
  }
`;

export const SearchTypeSelect = styled.select`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[700]};
  background: ${props => props.theme.colors.white};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`;

export const SearchInput = styled.input`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.sm};
  min-width: 240px;
  transition: all ${props => props.theme.transitions.base};

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    min-width: auto;
    flex: 1;
  }
`;

export const SearchButton = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.primary[600]};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.base};
  font-weight: ${props => props.theme.fonts.weight.medium};
  font-size: ${props => props.theme.fonts.size.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.colors.primary[700]};
  }
`;

export const GrowthLogList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing[6]};

  /* 중간 화면 (1440px 이상) - 4개 */
  @media (min-width: 1440px) {
    grid-template-columns: repeat(4, 1fr);
  }

  /* 큰 화면 (1920px 이상) - 5개 */
  @media (min-width: 1920px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

export const GrowthLogCard = styled.div`
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: ${props => props.theme.colors.gray[300]};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

export const GrowthLogCardImage = styled.div`
  height: 200px;
  background-color: ${props => props.theme.colors.gray[100]};
  background-image: url(${props => props.$src});
  background-size: cover;
  background-position: center;
`;

export const GrowthLogCardContent = styled.div`
  padding: ${props => props.theme.spacing[5]};
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const GrowthLogTag = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  background: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[700]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: ${props => props.theme.fonts.weight.medium};
  margin-bottom: ${props => props.theme.spacing[2]};
  width: fit-content;
`;

export const GrowthLogTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0 0 ${props => props.theme.spacing[2]} 0;
  line-height: 1.4;
`;

export const GrowthLogExcerpt = styled.p`
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[600]};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const GrowthLogMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${props => props.theme.spacing[4]};
  border-top: 1px solid ${props => props.theme.colors.gray[100]};
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[500]};
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`;

export const GrowthLogDate = styled.div`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[400]};
  white-space: nowrap;
  margin-left: auto;
`;

export const GrowthLogInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[3]};
`;

export const TagList = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[1]};
  flex-wrap: wrap;
  overflow: hidden;
  height: 24px; // Limit height to one line if possible or let it wrap safely
`;

export const Tag = styled.span`
  background: ${props => props.theme.colors.gray[100]};
  color: ${props => props.theme.colors.gray[600]};
  font-size: ${props => props.theme.fonts.size.xs};
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
`;

export const CommentCount = styled.span`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
  color: ${props => props.theme.colors.gray[500]};
  font-weight: ${props => props.theme.fonts.weight.medium};
  margin-right: ${props => props.theme.spacing[3]};
`;

export const LikeCount = styled.span`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
  color: ${props => props.theme.colors.rose ? props.theme.colors.rose[500] : props.theme.colors.gray[500]};
  font-weight: ${props => props.theme.fonts.weight.medium};
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[16]} ${props => props.theme.spacing[4]};
  text-align: center;
  background: ${props => props.theme.colors.white};
  border: 2px dashed ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
`;

export const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${props => props.theme.spacing[4]};
`;

export const EmptyTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.xl};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

export const EmptyDescription = styled.p`
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: ${props => props.theme.spacing[6]};
`;

export const Loading = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[10]};
  color: ${props => props.theme.colors.gray[500]};
  font-size: ${props => props.theme.fonts.size.lg};
`;

// 내 글 탭 하위 필터
export const StatusFilterTabs = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[4]};
  padding: ${props => props.theme.spacing[2]};
  background: ${props => props.theme.colors.gray[50]};
  border-radius: ${props => props.theme.borderRadius.base};
`;

export const StatusFilterTab = styled.button`
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[3]};
  background: ${props => props.$active ? props.theme.colors.primary[600] : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.white : props.theme.colors.gray[600]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.$active ? props.theme.fonts.weight.semibold : props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  white-space: nowrap;

  &:hover {
    background: ${props => props.$active ? props.theme.colors.primary[700] : props.theme.colors.gray[100]};
  }
`;

// 배지 스타일
export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  background: ${props => props.$type === 'draft' ? props.theme.colors.gray[200] : props.theme.colors.blue[100]};
  color: ${props => props.$type === 'draft' ? props.theme.colors.gray[700] : props.theme.colors.blue[700]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  margin-right: ${props => props.theme.spacing[2]};
`;

export const VisibilityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  background: ${props => props.theme.colors.warning[300]};
  color: ${props => props.theme.colors.gray[800]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: ${props => props.theme.fonts.weight.medium};
`;

export const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[2]};
`;