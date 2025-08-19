import { css } from 'styled-components';
import theme from './theme';

// Mobile-first approach with min-width breakpoints
export const media = Object.keys(theme.breakpoints).reduce((acc, key) => {
  acc[key] = (...args) => css`
    @media (min-width: ${theme.breakpoints[key]}) {
      ${css(...args)}
    }
  `;
  return acc;
}, {});

// Additional utility functions for common patterns
export const mediaMax = Object.keys(theme.breakpoints).reduce((acc, key) => {
  acc[key] = (...args) => css`
    @media (max-width: calc(${theme.breakpoints[key]} - 1px)) {
      ${css(...args)}
    }
  `;
  return acc;
}, {});

// Range queries (between two breakpoints)
export const mediaBetween = (minBreakpoint, maxBreakpoint) => (...args) => css`
  @media (min-width: ${theme.breakpoints[minBreakpoint]}) and (max-width: calc(${theme.breakpoints[maxBreakpoint]} - 1px)) {
    ${css(...args)}
  }
`;

// Specific device queries
export const mediaOnly = {
  mobile: (...args) => css`
    @media (max-width: calc(${theme.breakpoints.md} - 1px)) {
      ${css(...args)}
    }
  `,
  tablet: (...args) => css`
    @media (min-width: ${theme.breakpoints.md}) and (max-width: calc(${theme.breakpoints.lg} - 1px)) {
      ${css(...args)}
    }
  `,
  desktop: (...args) => css`
    @media (min-width: ${theme.breakpoints.lg}) {
      ${css(...args)}
    }
  `,
};

// Print and special media queries
export const print = (...args) => css`
  @media print {
    ${css(...args)}
  }
`;

export const darkMode = (...args) => css`
  @media (prefers-color-scheme: dark) {
    ${css(...args)}
  }
`;

export const reducedMotion = (...args) => css`
  @media (prefers-reduced-motion: reduce) {
    ${css(...args)}
  }
`;

export const highContrast = (...args) => css`
  @media (prefers-contrast: high) {
    ${css(...args)}
  }
`;