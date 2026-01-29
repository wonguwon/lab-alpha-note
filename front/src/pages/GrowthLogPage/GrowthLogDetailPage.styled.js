import styled from 'styled-components';
import { flexCenter, flexBetween } from '../../styles/mixins';

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

export const GrowthLogCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing[4]};
`;

export const GrowthLogHeader = styled.div`
  padding: 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 1.5rem;
  }
`;

export const GrowthLogTitle = styled.h1`
  font-size: ${props => props.theme.fonts.size['3xl']};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  line-height: ${props => props.theme.fonts.lineHeight.tight};
  word-break: keep-all;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fonts.size['2xl']};
  }
`;

export const GrowthLogMeta = styled.div`
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

export const GrowthLogImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  display: block;
`;

export const GrowthLogBody = styled.div`
  padding: 3rem;  
  font-size: ${props => props.theme.fonts.size.base};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
  color: ${props => props.theme.colors.gray[800]};
  word-break: break-word;

  img {
    max-width: 100%;
    height: auto;
    border-radius: ${props => props.theme.borderRadius.md};
  }

  p {
    margin-bottom: ${props => props.theme.spacing[4]};
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${props => props.theme.colors.gray[900]};
    margin: ${props => props.theme.spacing[6]} 0 ${props => props.theme.spacing[3]} 0;
    font-weight: ${props => props.theme.fonts.weight.bold};
  }
  
  ul, ol {
    margin-bottom: ${props => props.theme.spacing[4]};
    padding-left: ${props => props.theme.spacing[6]};
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  /* 링크 스타일 */
  a {
    color: ${props => props.theme.colors.primary[600]};
    text-decoration: none;
    font-weight: ${props => props.theme.fonts.weight.medium};
    transition: all ${props => props.theme.transitions.fast};

    &:hover {
      color: ${props => props.theme.colors.primary[700]};
      text-decoration: underline;
    }
  }

  blockquote {
    border-left: 4px solid ${props => props.theme.colors.gray[300]};
    padding-left: ${props => props.theme.spacing[4]};
    margin: ${props => props.theme.spacing[4]} 0;
    color: ${props => props.theme.colors.gray[600]};
    font-style: italic;
  }

  /* 줄바꿈 스타일 (remarkBreaks 플러그인용) */
  br {
    line-height: 0;
    content: "";
    display: block;
    margin: 0;
  }

  /* 테이블 스타일 (GFM) */
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1.5rem 0;
    font-size: ${props => props.theme.fonts.size.sm};
  }

  th, td {
    border: 1px solid ${props => props.theme.colors.gray[200]};
    padding: ${props => props.theme.spacing[3]};
    text-align: left;
  }

  th {
    background: ${props => props.theme.colors.gray[50]};
    font-weight: ${props => props.theme.fonts.weight.bold};
    color: ${props => props.theme.colors.gray[900]};
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 1.5rem;
  }
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[2]};
  margin-top: ${props => props.theme.spacing[4]};
`;

export const Tag = styled.span`
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[700]};
  border: 1px solid ${props => props.theme.colors.primary[200]};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: ${props => props.theme.fonts.weight.medium};
`;

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

export const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  justify-content: flex-end;
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  background: ${props => props.$danger ? props.theme.colors.white : props.theme.colors.white};
  color: ${props => props.$danger ? props.theme.colors.danger[600] : props.theme.colors.gray[600]};
  border: 1px solid ${props => props.$danger ? props.theme.colors.danger[300] : props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  svg {
    flex-shrink: 0;
  }

  &:hover {
    background: ${props => props.$danger ? props.theme.colors.danger[50] : props.theme.colors.gray[50]};
    color: ${props => props.$danger ? props.theme.colors.danger[700] : props.theme.colors.gray[900]};
    border-color: ${props => props.$danger ? props.theme.colors.danger[400] : props.theme.colors.gray[400]};
  }

  &:active {
    transform: translateY(1px);
  }
`;

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
`;

export const LoadingState = styled.div`
  ${flexCenter}
  padding: ${props => props.theme.spacing[12]};
  font-size: ${props => props.theme.fonts.size.lg};
  color: ${props => props.theme.colors.gray[500]};
`;

/* 댓글 섹션 */
export const CommentSection = styled.div`
  margin-top: ${props => props.theme.spacing[2]};
`;

export const CommentList = styled.div`
  display: flex;
  flex-direction: column;
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
  justify-content: space-between;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

export const CommentAuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  flex: 1;
`;

export const CommentActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
`;

export const CommentEditButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray[400]};
  cursor: pointer;
  padding: ${props => props.theme.spacing[1]};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.primary[600]};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const CommentDeleteButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray[400]};
  cursor: pointer;
  padding: ${props => props.theme.spacing[1]};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.danger[600]};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const CommentContentWrapper = styled.div`
  padding-left: ${props => props.theme.spacing[9]};
`;

export const CommentContent = styled.p`
  font-size: ${props => props.theme.fonts.size.sm};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
  color: ${props => props.theme.colors.gray[700]};
  margin: 0;
`;

export const CommentTime = styled.span`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[500]};
`;

export const EditCommentInput = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-family: inherit;
  line-height: 1.6;
  min-height: 60px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`;

export const EditCommentActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  margin-top: ${props => props.theme.spacing[2]};
  justify-content: flex-end;
`;

export const SaveButton = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.primary[600]};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: background ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.primary[700]};
  }
`;

export const CancelButton = styled.button`
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
    border-color: ${props => props.theme.colors.gray[400]};
  }
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
