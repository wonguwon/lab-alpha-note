import styled from 'styled-components';
import { flexCenter, flexColumn, flexBetween } from '../../styles/mixins';

/* 메인 컨테이너 */
export const DetailContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing[6]} ${props => props.theme.spacing[4]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[3]};
  }
`;

/* 질문 카드 */
export const QuestionCard = styled.div`
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[4]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[4]};
  }
`;

/* 질문 헤더 (태그 + 통계) */
export const QuestionHeader = styled.div`
  ${flexBetween}
  gap: ${props => props.theme.spacing[4]};
  flex-wrap: wrap;
  margin-bottom: ${props => props.theme.spacing[4]};
`;

/* 태그 목록 */
export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[2]};
`;

export const Tag = styled.span`
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[700]};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: ${props => props.theme.fonts.weight.medium};
`;

/* 통계 */
export const Stats = styled.div`
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
    ? props.theme.colors.green[600]
    : props.theme.colors.gray[700]};
`;

/* 질문 제목 */
export const QuestionTitle = styled.h1`
  font-size: ${props => props.theme.fonts.size['2xl']};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  line-height: ${props => props.theme.fonts.lineHeight.tight};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fonts.size.xl};
  }
`;

/* 질문 내용 */
export const QuestionContent = styled.div`
  font-size: ${props => props.theme.fonts.size.base};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
  color: ${props => props.theme.colors.gray[700]};
  margin-bottom: ${props => props.theme.spacing[4]};
  word-break: break-word;

  p {
    margin-bottom: ${props => props.theme.spacing[3]};
  }

  code {
    background: ${props => props.theme.colors.gray[100]};
    padding: 2px 6px;
    border-radius: ${props => props.theme.borderRadius.sm};
    font-family: monospace;
    font-size: 0.9em;
  }

  pre {
    background: ${props => props.theme.colors.gray[900]};
    color: ${props => props.theme.colors.white};
    padding: ${props => props.theme.spacing[4]};
    border-radius: ${props => props.theme.borderRadius.md};
    overflow-x: auto;
    margin-bottom: ${props => props.theme.spacing[3]};

    code {
      background: transparent;
      padding: 0;
      color: inherit;
    }
  }
`;

/* 메타 정보 */
export const MetaInfo = styled.div`
  ${flexBetween}
  padding-top: ${props => props.theme.spacing[4]};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`;

export const AuthorAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

export const AuthorDetails = styled.div`
  ${flexColumn}
  gap: ${props => props.theme.spacing[1]};
`;

export const AuthorName = styled.span`
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  font-size: ${props => props.theme.fonts.size.sm};
`;

export const TimeInfo = styled.span`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[500]};
`;

/* 액션 버튼 */
export const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
`;

export const VoteButton = styled.button`
  ${flexCenter}
  gap: ${props => props.theme.spacing[1]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  background: ${props => props.$voted ? props.theme.colors.primary[50] : props.theme.colors.white};
  color: ${props => props.$voted ? props.theme.colors.primary[700] : props.theme.colors.gray[700]};
  border: 1px solid ${props => props.$voted ? props.theme.colors.primary[300] : props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.$voted ? props.theme.colors.primary[100] : props.theme.colors.gray[50]};
    border-color: ${props => props.$voted ? props.theme.colors.primary[400] : props.theme.colors.gray[400]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* 섹션 */
export const Section = styled.section`
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[4]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[4]};
  }
`;

export const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fonts.size.xl};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
`;

/* 댓글 */
export const CommentList = styled.div`
  ${flexColumn}
  gap: ${props => props.theme.spacing[3]};
`;

export const CommentItem = styled.div`
  padding: ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.gray[50]};
  border-radius: ${props => props.theme.borderRadius.md};
`;

export const CommentHeader = styled.div`
  ${flexBetween}
  margin-bottom: ${props => props.theme.spacing[2]};
`;

export const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`;

export const CommentAuthorAvatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
`;

export const CommentAuthorName = styled.span`
  font-weight: ${props => props.theme.fonts.weight.medium};
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[900]};
`;

export const CommentTime = styled.span`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[500]};
`;

export const CommentContent = styled.p`
  font-size: ${props => props.theme.fonts.size.sm};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
  color: ${props => props.theme.colors.gray[700]};
  margin: 0;
`;

/* 댓글 작성 폼 */
export const CommentForm = styled.form`
  margin-top: ${props => props.theme.spacing[4]};
  padding-top: ${props => props.theme.spacing[4]};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
`;

export const CommentTextarea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-family: inherit;
  line-height: 1.5;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 1px ${props => props.theme.colors.primary[500]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`;

export const CommentSubmitButton = styled.button`
  margin-top: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.primary[600]};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: background ${props => props.theme.transitions.base};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary[700]};
  }

  &:disabled {
    background: ${props => props.theme.colors.gray[400]};
    cursor: not-allowed;
  }
`;

/* 답변 */
export const AnswerList = styled.div`
  ${flexColumn}
  gap: ${props => props.theme.spacing[4]};
`;

export const AnswerItem = styled.div`
  padding: ${props => props.theme.spacing[5]};
  background: ${props => props.$accepted ? props.theme.colors.green[50] : props.theme.colors.white};
  border: 1px solid ${props => props.$accepted ? props.theme.colors.green[300] : props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
`;

export const AnswerHeader = styled.div`
  ${flexBetween}
  margin-bottom: ${props => props.theme.spacing[3]};
`;

export const AcceptedBadge = styled.span`
  ${flexCenter}
  gap: ${props => props.theme.spacing[1]};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.green[600]};
  color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: ${props => props.theme.fonts.weight.semibold};
`;

export const AnswerContent = styled.div`
  font-size: ${props => props.theme.fonts.size.base};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
  color: ${props => props.theme.colors.gray[700]};
  margin-bottom: ${props => props.theme.spacing[4]};
  word-break: break-word;

  p {
    margin-bottom: ${props => props.theme.spacing[3]};
  }

  code {
    background: ${props => props.theme.colors.gray[100]};
    padding: 2px 6px;
    border-radius: ${props => props.theme.borderRadius.sm};
    font-family: monospace;
    font-size: 0.9em;
  }

  pre {
    background: ${props => props.theme.colors.gray[900]};
    color: ${props => props.theme.colors.white};
    padding: ${props => props.theme.spacing[4]};
    border-radius: ${props => props.theme.borderRadius.md};
    overflow-x: auto;
    margin-bottom: ${props => props.theme.spacing[3]};

    code {
      background: transparent;
      padding: 0;
      color: inherit;
    }
  }
`;

export const AnswerFooter = styled.div`
  ${flexBetween}
  padding-top: ${props => props.theme.spacing[3]};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
`;

/* 답변 작성 */
export const AnswerForm = styled.form`
  ${flexColumn}
  gap: ${props => props.theme.spacing[3]};
`;

export const AnswerTextarea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing[4]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.base};
  font-family: inherit;
  line-height: 1.6;
  resize: vertical;
  min-height: 200px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 1px ${props => props.theme.colors.primary[500]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`;

export const AnswerSubmitButton = styled.button`
  align-self: flex-end;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.primary[600]};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  cursor: pointer;
  transition: background ${props => props.theme.transitions.base};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary[700]};
  }

  &:disabled {
    background: ${props => props.theme.colors.gray[400]};
    cursor: not-allowed;
  }
`;

/* 빈 상태 */
export const EmptyState = styled.div`
  ${flexCenter}
  flex-direction: column;
  padding: ${props => props.theme.spacing[12]} ${props => props.theme.spacing[4]};
  text-align: center;
  color: ${props => props.theme.colors.gray[500]};
  font-size: ${props => props.theme.fonts.size.sm};
`;
