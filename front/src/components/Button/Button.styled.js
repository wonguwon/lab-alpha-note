import styled, { css } from 'styled-components';
import { buttonBase, buttonPrimary, buttonSecondary, buttonOutline } from '../../styles/mixins';

const getVariantStyles = (variant) => {
  const variants = {
    primary: buttonPrimary,
    secondary: buttonSecondary,
    outline: buttonOutline,
    success: css`
      ${buttonBase}
      background: ${props => props.theme.colors.success[500]};
      color: ${props => props.theme.colors.white};
      
      &:hover:not(:disabled) {
        background: ${props => props.theme.colors.success[600]};
      }
    `,
    warning: css`
      ${buttonBase}
      background: ${props => props.theme.colors.warning[500]};
      color: ${props => props.theme.colors.white};
      
      &:hover:not(:disabled) {
        background: ${props => props.theme.colors.warning[600]};
      }
    `,
    danger: css`
      ${buttonBase}
      background: ${props => props.theme.colors.danger[500]};
      color: ${props => props.theme.colors.white};
      
      &:hover:not(:disabled) {
        background: ${props => props.theme.colors.danger[600]};
      }
    `,
    ghost: css`
      ${buttonBase}
      background: transparent;
      color: ${props => props.theme.colors.gray[600]};
      
      &:hover:not(:disabled) {
        background: ${props => props.theme.colors.gray[100]};
      }
    `,
  };
  
  return variants[variant] || variants.primary;
};

const getSizeStyles = (size) => {
  const sizes = {
    small: css`
      padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
      font-size: ${props => props.theme.fonts.size.sm};
      min-height: 32px;
    `,
    medium: css`
      padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
      font-size: ${props => props.theme.fonts.size.base};
      min-height: 40px;
    `,
    large: css`
      padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[6]};
      font-size: ${props => props.theme.fonts.size.lg};
      min-height: 48px;
    `,
  };
  
  return sizes[size] || sizes.medium;
};

export const Button = styled.button`
  ${props => getVariantStyles(props.variant)}
  ${props => getSizeStyles(props.size)}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  ${props => props.disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  `}
`;

export const Icon = styled.span`
  display: flex;
  align-items: center;
  
  ${props => props.position === 'left' && css`
    margin-right: ${props => props.theme.spacing[2]};
  `}
  
  ${props => props.position === 'right' && css`
    margin-left: ${props => props.theme.spacing[2]};
  `}
`;