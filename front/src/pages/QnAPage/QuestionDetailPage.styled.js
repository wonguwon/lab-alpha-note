import styled from 'styled-components';
import { flexCenter, flexColumn, flexBetween } from '../../styles/mixins';

/* 메인 컨테이너 */
export const DetailContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing[6]} ${props => props.theme.spacing[4]};
  min-height: 100vh;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[3]};
    padding-bottom: 100px;
  }
`;

/* 뒤로가기 버튼 */
export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  margin-bottom: ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.gray[700]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
    border-color: ${props => props.theme.colors.gray[400]};
  }
`;

/* 질문 카드 */
export const QuestionCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing[4]};
`;

/* 질문 헤더 */
export const QuestionHeader = styled.div`
  padding: ${props => props.theme.spacing[5]} 0;
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[4]} 0;
  }
`;

/* 질문 제목 */
export const QuestionTitle = styled.h1`
  display: flex;                
  align-items: center;          
  gap: 8px;                    
  font-size: ${props => props.theme.fonts.size['3xl']};
  font-weight: ${props => props.theme.fonts.weight.normal};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  line-height: ${props => props.theme.fonts.lineHeight.tight};
  word-break: keep-all;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fonts.size['2xl']};
  }
`;

/* 질문 메타 정보 */
export const QuestionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  flex-wrap: wrap;
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`;

export const AuthorAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${props => props.theme.colors.gray[200]};
`;

export const AuthorName = styled.span`
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  font-size: ${props => props.theme.fonts.size.sm};
`;

export const MetaDivider = styled.span`
  color: ${props => props.theme.colors.gray[300]};
`;

export const TimeStamp = styled.span`
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[500]};
`;

/* 통계 정보 */
export const Stats = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  align-items: center;
  margin-left: auto;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-left: 0;
    width: 100%;
  }
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[600]};

  strong {
    font-weight: ${props => props.theme.fonts.weight.semibold};
    color: ${props => props.theme.colors.gray[900]};
  }
`;

/* 질문 본문 */
export const QuestionBody = styled.div`
  padding: ${props => props.theme.spacing[6]} 0;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[4]} 0;
  }
`;

export const QuestionContent = styled.div`
  font-size: ${props => props.theme.fonts.size.base};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
  color: ${props => props.theme.colors.gray[800]};
  word-break: break-word;
  white-space: pre-wrap;

  p {
    margin-bottom: ${props => props.theme.spacing[3]};
  }

  code {
    background: ${props => props.theme.colors.gray[100]};
    padding: 2px 6px;
    border-radius: ${props => props.theme.borderRadius.sm};
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 0.9em;
    color: ${props => props.theme.colors.purple[700]};
  }

  pre {
    background: ${props => props.theme.colors.gray[900]};
    color: ${props => props.theme.colors.gray[100]};
    padding: ${props => props.theme.spacing[4]};
    border-radius: ${props => props.theme.borderRadius.md};
    overflow-x: auto;
    margin: ${props => props.theme.spacing[3]} 0;

    code {
      background: transparent;
      padding: 0;
      color: inherit;
    }
  }
`;

/* 태그 영역 */
export const QuestionFooter = styled.div`
  padding: ${props => props.theme.spacing[4]} 0;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  }
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[2]};
`;

export const Tag = styled.span`
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.primary[700]};
  border: 1px solid ${props => props.theme.colors.primary[200]};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: ${props => props.theme.fonts.weight.medium};
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.primary[50]};
    border-color: ${props => props.theme.colors.primary[300]};
  }
`;

/* 액션 바 */
export const ActionBar = styled.div`
  ${flexBetween}
  padding: ${props => props.theme.spacing[4]} 0;
  background: ${props => props.theme.colors.white};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[3]} 0;
    flex-direction: column;
    gap: ${props => props.theme.spacing[3]};
  }
`;

export const VoteSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`;

export const VoteButton = styled.button`
  ${flexCenter}
  gap: ${props => props.theme.spacing[1]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  background: ${props => props.$voted ? props.theme.colors.primary[50] : props.theme.colors.white};
  color: ${props => props.$voted ? props.theme.colors.primary[700] : props.theme.colors.gray[700]};
  border: 1px solid ${props => props.$voted ? props.theme.colors.primary[300] : props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover:not(:disabled) {
    background: ${props => props.$voted ? props.theme.colors.primary[100] : props.theme.colors.gray[50]};
    border-color: ${props => props.$voted ? props.theme.colors.primary[400] : props.theme.colors.gray[400]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const VoteCount = styled.span`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.primary[600]};
  min-width: 40px;
  text-align: center;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
`;

export const ActionButton = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.gray[600]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
    color: ${props => props.theme.colors.gray[900]};
    border-color: ${props => props.theme.colors.gray[400]};
  }
`;

/* 섹션 */
export const Section = styled.section`
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing[4]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

export const SectionHeader = styled.div`
  padding: ${props => props.theme.spacing[5]} ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.gray[50]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[4]};
  }
`;

export const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fonts.size.xl};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0;
`;

export const SectionBody = styled.div`
  padding: ${props => props.theme.spacing[6]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[4]};
  }
`;

/* 댓글 */
export const CommentList = styled.div`
  ${flexColumn}
  gap: ${props => props.theme.spacing[2]};
  margin-top: ${props => props.theme.spacing[4]};
`;

export const CommentItem = styled.div`
  padding: ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.gray[50]};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.gray[100]};
`;

export const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

export const CommentContent = styled.p`
  font-size: ${props => props.theme.fonts.size.sm};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
  color: ${props => props.theme.colors.gray[700]};
  margin: 0;
  padding-left: ${props => props.theme.spacing[9]};
`;

export const CommentTime = styled.span`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[500]};
`;

/* 댓글 작성 폼 */
export const CommentForm = styled.form`
  width: 100%;
`;

export const CommentInputArea = styled.div`
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  min-height: 135px;
  padding: ${props => props.theme.spacing[4]};
  display: flex;
  flex-direction: column;

  &:focus-within {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`;

export const CommentInput = styled.textarea`
  width: 100%;
  font-size: ${props => props.theme.fonts.size.base};
  font-family: inherit;
  line-height: 1.6;
  min-height: 80px;
  border: none;
  outline: none;
  resize: none;

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`;

export const CommentInputFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${props => props.theme.spacing[2]};
  padding-top: ${props => props.theme.spacing[2]};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
`;

export const CharacterCount = styled.span`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.$isOverLimit
    ? props.theme.colors.danger[600]
    : props.theme.colors.gray[500]};
  font-weight: ${props => props.theme.fonts.weight.medium};
`;

export const SendIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: ${props => props.disabled
    ? props.theme.colors.gray[300]
    : props.theme.colors.primary[600]};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all ${props => props.theme.transitions.base};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary[700]};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  svg {
    font-size: 1.1rem;
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
  gap: 0;
`;

export const AnswerItem = styled.div`
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.$isAccepted ? props.theme.colors.success[50] : props.theme.colors.white};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[4]};
  }
`;

export const AcceptedBadge = styled.div`
  ${flexCenter}
  gap: ${props => props.theme.spacing[1]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.success[600]};
  color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.bold};
  margin-bottom: ${props => props.theme.spacing[4]};
  width: fit-content;
`;

export const AnswerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing[4]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing[3]};
  }
`;

export const AnswerAuthor = styled.span`
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  font-size: ${props => props.theme.fonts.size.sm};
`;

export const AnswerContent = styled.div`
  font-size: ${props => props.theme.fonts.size.base};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: ${props => props.theme.spacing[4]};
  word-break: break-word;
  white-space: pre-wrap;

  p {
    margin-bottom: ${props => props.theme.spacing[3]};
  }

  code {
    background: ${props => props.theme.colors.gray[100]};
    padding: 2px 6px;
    border-radius: ${props => props.theme.borderRadius.sm};
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 0.9em;
    color: ${props => props.theme.colors.purple[700]};
  }

  pre {
    background: ${props => props.theme.colors.gray[900]};
    color: ${props => props.theme.colors.gray[100]};
    padding: ${props => props.theme.spacing[4]};
    border-radius: ${props => props.theme.borderRadius.md};
    overflow-x: auto;
    margin: ${props => props.theme.spacing[3]} 0;

    code {
      background: transparent;
      padding: 0;
      color: inherit;
    }
  }
`;

export const AnswerActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  padding-top: ${props => props.theme.spacing[3]};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
`;

/* 답변 작성 */
export const AnswerForm = styled.form`
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.white};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[4]};
  }
`;

export const AnswerFormTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
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
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`;

export const AnswerSubmitButton = styled.button`
  margin-top: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.primary[600]};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.base};
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

  h3 {
    font-size: ${props => props.theme.fonts.size.xl};
    font-weight: ${props => props.theme.fonts.weight.bold};
    color: ${props => props.theme.colors.gray[700]};
    margin: 0 0 ${props => props.theme.spacing[2]} 0;
  }

  p {
    font-size: ${props => props.theme.fonts.size.sm};
    margin: 0;
  }
`;

/* 로딩 상태 */
export const LoadingState = styled.div`
  ${flexCenter}
  padding: ${props => props.theme.spacing[12]};
  font-size: ${props => props.theme.fonts.size.lg};
  color: ${props => props.theme.colors.gray[500]};
`;

/* 메타 정보 */
export const MetaInfo = styled.div`
  ${flexBetween}
  width: 100%;
`;

/* 댓글 토글 버튼 */
export const CommentToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  background: transparent;
  color: ${props => props.theme.colors.gray[600]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
    border-color: ${props => props.theme.colors.gray[400]};
    color: ${props => props.theme.colors.gray[900]};
  }

  svg {
    font-size: 1rem;
  }
`;

/* 댓글 섹션 */
export const CommentSection = styled.div`
  margin-top: ${props => props.theme.spacing[2]};
`;

/* 하단 고정 답변 버튼 */
export const FixedAnswerButton = styled.button`
  position: fixed;
  bottom: ${props => props.theme.spacing[8]};
  left: 50%;
  transform: translateX(-50%);
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[8]};
  background: ${props => props.theme.colors.primary[600]};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: ${props => props.theme.fonts.weight.bold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  z-index: ${props => props.theme.zIndex.sticky};

  &:hover {
    background: ${props => props.theme.colors.primary[700]};
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    transform: translateX(-50%) translateY(-2px);
  }

  &:active {
    transform: translateX(-50%) translateY(0);
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
    font-size: ${props => props.theme.fonts.size.base};
  }
`;
