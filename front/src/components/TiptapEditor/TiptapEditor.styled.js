import styled from 'styled-components';

export const EditorContainer = styled.div`
  position: relative;
  border: 1px solid ${props => props.$error ? props.theme.colors.danger[500] : props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.white};
  overflow: hidden;

  &:focus-within {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const MenuBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[1]};
  padding: ${props => props.theme.spacing[2]};
  background: ${props => props.theme.colors.gray[50]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
`;

export const MenuButton = styled.button`
  min-width: 32px;
  height: 32px;
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  background: ${props => props.$active ? props.theme.colors.primary[100] : props.theme.colors.white};
  color: ${props => props.$active ? props.theme.colors.primary[700] : props.theme.colors.gray[700]};
  border: 1px solid ${props => props.$active ? props.theme.colors.primary[300] : props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${props => props.$active ? props.theme.colors.primary[200] : props.theme.colors.gray[100]};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    display: block;
  }
`;

export const MenuDivider = styled.div`
  width: 1px;
  background: ${props => props.theme.colors.gray[300]};
  margin: 0 ${props => props.theme.spacing[1]};
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const EditorWrapper = styled.div`
  position: relative;

  .ProseMirror {
    padding: ${props => props.theme.spacing[4]};
    min-height: 200px;
    outline: none;

    > * + * {
      margin-top: 0.75em;
    }

    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: ${props => props.theme.colors.gray[400]};
      pointer-events: none;
      height: 0;
    }

    h1 {
      font-size: ${props => props.theme.fonts.size['2xl']};
      font-weight: ${props => props.theme.fonts.weight.bold};
      line-height: 1.2;
    }

    h2 {
      font-size: ${props => props.theme.fonts.size.xl};
      font-weight: ${props => props.theme.fonts.weight.bold};
      line-height: 1.3;
    }

    h3 {
      font-size: ${props => props.theme.fonts.size.lg};
      font-weight: ${props => props.theme.fonts.weight.semibold};
      line-height: 1.4;
    }

    code {
      background: ${props => props.theme.colors.gray[100]};
      color: ${props => props.theme.colors.danger[600]};
      padding: 0.2em 0.4em;
      border-radius: ${props => props.theme.borderRadius.sm};
      font-size: 0.9em;
      font-family: 'Courier New', monospace;
    }

    pre {
      background: ${props => props.theme.colors.gray[900]};
      color: ${props => props.theme.colors.gray[100]};
      padding: ${props => props.theme.spacing[4]};
      border-radius: ${props => props.theme.borderRadius.md};
      overflow-x: auto;

      code {
        background: none;
        color: inherit;
        padding: 0;
        font-size: 0.9em;
      }
    }

    ul, ol {
      padding-left: ${props => props.theme.spacing[6]};
    }

    ul {
      list-style-type: disc;
    }

    ol {
      list-style-type: decimal;
    }

    blockquote {
      padding-left: ${props => props.theme.spacing[4]};
      border-left: 3px solid ${props => props.theme.colors.gray[300]};
      color: ${props => props.theme.colors.gray[600]};
      font-style: italic;
    }

    a {
      color: ${props => props.theme.colors.primary[600]};
      text-decoration: underline;
      cursor: pointer;

      &:hover {
        color: ${props => props.theme.colors.primary[700]};
      }
    }

    hr {
      border: none;
      border-top: 2px solid ${props => props.theme.colors.gray[300]};
      margin: ${props => props.theme.spacing[4]} 0;
    }

    strong {
      font-weight: ${props => props.theme.fonts.weight.bold};
    }

    em {
      font-style: italic;
    }

    s {
      text-decoration: line-through;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: ${props => props.theme.borderRadius.md};
      margin: ${props => props.theme.spacing[2]} 0;
      display: block;
      cursor: pointer;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.9;
      }

      &.ProseMirror-selectednode {
        outline: 2px solid ${props => props.theme.colors.primary[500]};
        outline-offset: 2px;
      }
    }
  }
`;

export const ImageResizeMenu = styled.div`
  position: absolute;
  z-index: 1000;
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.sm};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: ${props => props.theme.spacing[1]};
  display: flex;
  gap: ${props => props.theme.spacing[1]};
  left: ${props => props.$left}px;
  top: ${props => props.$top}px;
  animation: fadeIn 0.15s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const SizeButton = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[2]};
  background: ${props => props.$active ? props.theme.colors.primary[500] : props.theme.colors.white};
  color: ${props => props.$active ? props.theme.colors.white : props.theme.colors.gray[700]};
  border: 1px solid ${props => props.$active ? props.theme.colors.primary[500] : props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  line-height: 1;

  &:hover {
    background: ${props => props.$active ? props.theme.colors.primary[600] : props.theme.colors.gray[50]};
    border-color: ${props => props.$active ? props.theme.colors.primary[600] : props.theme.colors.gray[400]};
  }
`;
