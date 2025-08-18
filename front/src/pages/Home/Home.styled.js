import styled from 'styled-components';
import { flexColumn, card, container, mobile } from '../../styles/mixins';

export const MainContainer = styled.main`
  ${container}
  padding-top: ${props => props.theme.spacing[6]};
  padding-bottom: ${props => props.theme.spacing[6]};
  min-height: calc(100vh - 200px);
`;

export const SectionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[6]};
  
  ${mobile`
    grid-template-columns: 1fr;
  `}
`;

export const Section = styled.section`
  ${card}
  overflow: hidden;
`;

export const SectionHeader = styled.div`
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[5]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`;

export const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[800]};
  margin: 0;
`;

export const PostList = styled.div`
  ${flexColumn}
`;

export const PostItem = styled.div`
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[5]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
  transition: all ${props => props.theme.transitions.base};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.gray[50]};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

export const PostTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.base};
  font-weight: ${props => props.theme.fonts.weight.medium};
  color: ${props => props.theme.colors.gray[800]};
  margin: 0 0 ${props => props.theme.spacing[2]} 0;
  line-height: ${props => props.theme.fonts.lineHeight.normal};
`;

export const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[500]};
`;

export const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
`;


export const Badge = styled.span`
  background: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[600]};
  font-size: ${props => props.theme.fonts.size.xs};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.full};
  font-weight: ${props => props.theme.fonts.weight.medium};
`;