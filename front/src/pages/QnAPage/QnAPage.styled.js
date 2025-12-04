import styled from 'styled-components';
import { flexBetween, flexColumn, container } from '../../styles/mixins';

/* QnA 메인 컨테이너 */
export const QnAContainer = styled.div`
  ${container}
  padding: ${props => props.theme.spacing[6]} ${props => props.theme.spacing[4]};
  max-width: 1200px;
`;

/* 헤더 영역 */
export const QnAHeader = styled.div`
  ${flexBetween}
  margin-bottom: ${props => props.theme.spacing[6]};
  gap: ${props => props.theme.spacing[3]};
`;

/* 제목 및 통계 영역 */
export const PageTitle = styled.h1`
  font-size: ${props => props.theme.fonts.size['3xl']};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0;
`;

export const QnAStats = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.gray[600]};
  font-size: ${props => props.theme.fonts.size.sm};
`;

/* 질문하기 버튼 */
export const AskButton = styled.button`
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
`;

/* 필터 및 검색 영역 */
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

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 90px;
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

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  }
`;

/* 질문 목록 */
export const QuestionList = styled.div`
  ${flexColumn}
  gap: ${props => props.theme.spacing[3]};
`;

/* 질문 카드 */
export const QuestionCard = styled.div`
  padding: ${props => props.theme.spacing[5]};
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${props => props.theme.colors.primary[300]};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    background: ${props => props.theme.colors.gray[50]};
  }
`;

/* 질문 내용 영역 */
export const QuestionContent = styled.div`
  ${flexColumn}
  gap: ${props => props.theme.spacing[3]};
`;

/* 질문 푸터 (태그 + 통계) */
export const QuestionFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
  flex-wrap: wrap;
`;

/* 질문 통계 영역 */
export const QuestionStats = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  align-items: center;
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
`;

export const StatLabel = styled.span`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[500]};
`;

export const StatValue = styled.span`
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.$answered
    ? props.theme.colors.success[600]
    : props.theme.colors.gray[700]};
`;

export const QuestionTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0;
  line-height: ${props => props.theme.fonts.lineHeight.snug};

  &:hover {
    color: ${props => props.theme.colors.primary[600]};
  }
`;

export const QuestionExcerpt = styled.p`
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[600]};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/* 태그 영역 */
export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[2]};
  margin-right: auto;
`;

export const Tag = styled.span`
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[700]};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: ${props => props.theme.fonts.weight.medium};
`;

/* 질문 메타 정보 */
export const QuestionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[500]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-wrap: wrap;
  }
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`;

export const AuthorAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;

export const AuthorName = styled.span`
  font-weight: ${props => props.theme.fonts.weight.medium};
  color: ${props => props.theme.colors.gray[700]};
`;

export const TimeAgo = styled.span`
  color: ${props => props.theme.colors.gray[500]};
`;

/* 페이지네이션 */
export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  margin-top: ${props => props.theme.spacing[8]};
`;

export const PageButton = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  background: ${props => props.$active ? props.theme.colors.primary[600] : props.theme.colors.white};
  color: ${props => props.$active ? props.theme.colors.white : props.theme.colors.gray[700]};
  border: 1px solid ${props => props.$active ? props.theme.colors.primary[600] : props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-weight: ${props => props.theme.fonts.weight.medium};
  font-size: ${props => props.theme.fonts.size.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  min-width: 36px;

  &:hover:not(:disabled) {
    background: ${props => props.$active ? props.theme.colors.primary[700] : props.theme.colors.gray[50]};
    border-color: ${props => props.$active ? props.theme.colors.primary[700] : props.theme.colors.gray[400]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* 빈 상태 */
export const EmptyState = styled.div`
  ${flexColumn}
  ${flexBetween}
  align-items: center;
  padding: ${props => props.theme.spacing[16]} ${props => props.theme.spacing[4]};
  text-align: center;
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
