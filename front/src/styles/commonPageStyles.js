import styled from 'styled-components';
import { flexBetween, flexCenter, container, card } from './mixins';

export const PageContainer = styled.div`
  ${container}
  padding-top: ${props => props.theme.spacing[6]};
  padding-bottom: ${props => props.theme.spacing[6]};
  min-height: calc(100vh - 200px);
`;

export const PageHeader = styled.div`
  ${flexBetween}
  margin-bottom: ${props => props.theme.spacing[6]};
`;

export const PageTitle = styled.h1`
  ${flexCenter}
  font-size: ${props => props.theme.fonts.size['3xl']};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[800]};
  gap: ${props => props.theme.spacing[2]};
  margin: 0;
  
  svg {
    color: ${props => props.theme.colors.primary[500]};
  }
`;

export const ContentArea = styled.div`
  ${card}
  padding: ${props => props.theme.spacing[10]};
  text-align: center;
`;

export const ContentTitle = styled.h2`
  font-size: ${props => props.theme.fonts.size.xl};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: ${props => props.theme.spacing[4]};
`;

export const ContentDescription = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  font-size: ${props => props.theme.fonts.size.base};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
`;