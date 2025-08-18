import { css } from 'styled-components';

// Flexbox mixins
export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const flexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

export const flexColumnCenter = css`
  ${flexColumn}
  align-items: center;
  justify-content: center;
`;

// Typography mixins
export const truncate = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const lineClamp = (lines) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// Card mixins
export const card = css`
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.sm};
`;

export const cardHover = css`
  ${card}
  transition: all ${props => props.theme.transitions.base};
  cursor: pointer;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-1px);
  }
`;

// Button mixins
export const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fonts.weight.medium};
  transition: all ${props => props.theme.transitions.base};
  cursor: pointer;
  border: none;
  text-decoration: none;
  white-space: nowrap;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const buttonPrimary = css`
  ${buttonBase}
  background: ${props => props.theme.colors.primary[500]};
  color: ${props => props.theme.colors.white};
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary[600]};
  }
  
  &:active:not(:disabled) {
    background: ${props => props.theme.colors.primary[700]};
  }
`;

export const buttonSecondary = css`
  ${buttonBase}
  background: ${props => props.theme.colors.gray[100]};
  color: ${props => props.theme.colors.gray[700]};
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.gray[200]};
  }
  
  &:active:not(:disabled) {
    background: ${props => props.theme.colors.gray[300]};
  }
`;

export const buttonOutline = css`
  ${buttonBase}
  background: transparent;
  color: ${props => props.theme.colors.primary[600]};
  border: 1px solid ${props => props.theme.colors.primary[300]};
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary[50]};
    border-color: ${props => props.theme.colors.primary[400]};
  }
  
  &:active:not(:disabled) {
    background: ${props => props.theme.colors.primary[100]};
  }
`;

// Input mixins
export const inputBase = css`
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.gray[900]};
  font-size: ${props => props.theme.fonts.size.base};
  transition: all ${props => props.theme.transitions.base};
  
  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
  
  &:disabled {
    background: ${props => props.theme.colors.gray[50]};
    color: ${props => props.theme.colors.gray[500]};
    cursor: not-allowed;
  }
`;

// Responsive mixins
export const mobile = (content) => css`
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    ${content}
  }
`;

export const tablet = (content) => css`
  @media (min-width: ${props => props.theme.breakpoints.md}) and (max-width: ${props => props.theme.breakpoints.lg}) {
    ${content}
  }
`;

export const desktop = (content) => css`
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    ${content}
  }
`;

// Animation mixins
export const fadeIn = css`
  animation: fadeIn ${props => props.theme.transitions.base};
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const slideUp = css`
  animation: slideUp ${props => props.theme.transitions.base};
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Layout mixins
export const container = css`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[5]};
`;

export const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// Loading skeleton
export const skeleton = css`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.gray[200]} 25%,
    ${props => props.theme.colors.gray[100]} 50%,
    ${props => props.theme.colors.gray[200]} 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;