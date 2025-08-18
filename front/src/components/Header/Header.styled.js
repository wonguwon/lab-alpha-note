import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { flexBetween, flexCenter, container, mobile } from '../../styles/mixins';

export const HeaderContainer = styled.header`
  background: ${props => props.theme.colors.white};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  position: sticky;
  top: 0;
  z-index: ${props => props.theme.zIndex.sticky};
  box-shadow: ${props => props.theme.shadows.sm};
`;

export const HeaderContent = styled.div`
  ${container}
  ${flexBetween}
  height: 64px;
  padding-top: 0;
  padding-bottom: 0;
`;

export const Logo = styled(Link)`
  font-size: ${props => props.theme.fonts.size['2xl']};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[800]};
  text-decoration: none;
`;

export const LogoAccent = styled.span`
  color: ${props => props.theme.colors.primary[500]};
`;

export const Nav = styled.nav`
  display: flex;
  gap: ${props => props.theme.spacing[8]};
  
  ${mobile`
    display: none;
  `}
`;

export const NavItem = styled(Link)`
  color: ${props => props.theme.colors.gray[600]};
  text-decoration: none;
  font-weight: ${props => props.theme.fonts.weight.medium};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    color: ${props => props.theme.colors.primary[600]};
    background: ${props => props.theme.colors.gray[50]};
  }
  
  &.active {
    color: ${props => props.theme.colors.primary[600]};
    background: ${props => props.theme.colors.primary[50]};
  }
`;

export const SearchContainer = styled.div`
  ${flexCenter}
  background: ${props => props.theme.colors.gray[50]};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  min-width: 300px;
  
  ${mobile`
    min-width: 200px;
  `}
`;

export const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  flex: 1;
  margin-left: ${props => props.theme.spacing[2]};
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[700]};
  
  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`;

export const UserActions = styled.div`
  ${flexCenter}
  gap: ${props => props.theme.spacing[4]};
`;

export const IconButton = styled.button`
  ${flexCenter}
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray[600]};
  cursor: pointer;
  padding: ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    color: ${props => props.theme.colors.primary[600]};
    background: ${props => props.theme.colors.gray[50]};
  }
`;