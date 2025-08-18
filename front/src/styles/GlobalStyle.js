import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${props => props.theme.fonts.family.primary};
    font-size: ${props => props.theme.fonts.size.base};
    font-weight: ${props => props.theme.fonts.weight.normal};
    line-height: ${props => props.theme.fonts.lineHeight.normal};
    color: ${props => props.theme.colors.gray[800]};
    background-color: ${props => props.theme.colors.white};
    min-height: 100vh;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Remove default styles */
  ul, ol {
    list-style: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
    font-size: inherit;
    border: none;
    background: transparent;
    cursor: pointer;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Focus styles */
  *:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.gray[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.gray[300]};
    border-radius: ${props => props.theme.borderRadius.base};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.gray[400]};
  }

  /* Selection */
  ::selection {
    background: ${props => props.theme.colors.primary[100]};
    color: ${props => props.theme.colors.primary[900]};
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Print styles */
  @media print {
    * {
      background: transparent !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }

    a, a:visited {
      text-decoration: underline;
    }

    img {
      max-width: 100% !important;
    }

    @page {
      margin: 0.5cm;
    }

    p, h2, h3 {
      orphans: 3;
      widows: 3;
    }

    h2, h3 {
      page-break-after: avoid;
    }
  }
`;

export default GlobalStyle;