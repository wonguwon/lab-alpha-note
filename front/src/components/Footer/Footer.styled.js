import styled from 'styled-components';
import { flexBetween, flexCenter, flexColumn, container, mobile } from '../../styles/mixins';

export const FooterContainer = styled.footer`
  background: ${props => props.theme.colors.gray[50]};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
  margin-top: auto;
`;

export const FooterContent = styled.div`
  ${container}
  padding-top: ${props => props.theme.spacing[10]};
  padding-bottom: ${props => props.theme.spacing[5]};
`;

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing[8]};
  margin-bottom: ${props => props.theme.spacing[8]};
`;

export const FooterSection = styled.div`
  ${flexColumn}
`;

export const SectionTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.base};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[800]};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
`;

export const Description = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  font-size: ${props => props.theme.fonts.size.sm};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
  margin: 0;
`;

export const LinkList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  ${flexColumn}
  gap: ${props => props.theme.spacing[2]};
`;

export const FooterLink = styled.a`
  color: ${props => props.theme.colors.gray[600]};
  text-decoration: none;
  font-size: ${props => props.theme.fonts.size.sm};
  transition: color ${props => props.theme.transitions.base};
  
  &:hover {
    color: ${props => props.theme.colors.primary[600]};
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  margin-top: ${props => props.theme.spacing[4]};
`;

export const SocialButton = styled.a`
  ${flexCenter}
  width: 40px;
  height: 40px;
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.gray[600]};
  text-decoration: none;
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    color: ${props => props.theme.colors.primary[600]};
    border-color: ${props => props.theme.colors.primary[300]};
    transform: translateY(-1px);
  }
`;

export const FooterBottom = styled.div`
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
  padding-top: ${props => props.theme.spacing[5]};
  ${flexBetween}
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[4]};
  
  ${mobile`
    flex-direction: column;
    text-align: center;
  `}
`;

export const Copyright = styled.div`
  color: ${props => props.theme.colors.gray[600]};
  font-size: ${props => props.theme.fonts.size.sm};
  ${flexCenter}
  gap: ${props => props.theme.spacing[1]};
`;

export const BottomLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[6]};
  
  ${mobile`
    flex-wrap: wrap;
    justify-content: center;
  `}
`;