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

export const BlogCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing[4]};
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

export const BlogHeader = styled.div`
  padding: ${props => props.theme.spacing[5]} 0;
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
  padding: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 1.5rem;
  }
`;

export const BlogTitle = styled.h1`
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

export const BlogMeta = styled.div`
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

export const BlogImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  display: block;
`;

export const BlogBody = styled.div`
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

  blockquote {
    border-left: 4px solid ${props => props.theme.colors.gray[300]};
    padding-left: ${props => props.theme.spacing[4]};
    margin: ${props => props.theme.spacing[4]} 0;
    color: ${props => props.theme.colors.gray[600]};
    font-style: italic;
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
  padding: ${props => props.theme.spacing[4]} 2rem;
  background: ${props => props.theme.colors.gray[50]};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[3]} 1.5rem;
    flex-direction: column;
    gap: ${props => props.theme.spacing[3]};
    align-items: stretch;
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

  &:hover {
    background: ${props => props.$danger ? props.theme.colors.danger[50] : props.theme.colors.gray[50]};
    color: ${props => props.$danger ? props.theme.colors.danger[700] : props.theme.colors.gray[900]};
    border-color: ${props => props.$danger ? props.theme.colors.danger[400] : props.theme.colors.gray[400]};
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
