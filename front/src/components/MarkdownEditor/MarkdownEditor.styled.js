import styled from 'styled-components';

export const EditorWrapper = styled.div`
  width: 100%;
  border: 1px solid ${props => props.$error ? '#ef4444' : props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  transition: all ${props => props.theme.transitions.base};
  background: ${props => props.theme.colors.white};

  &:focus-within {
    border-color: ${props => props.$error ? '#ef4444' : props.theme.colors.primary[600]};
    box-shadow: 0 0 0 1px ${props => props.$error ? '#ef4444' : props.theme.colors.primary[600]};
  }
`;

export const EditorHeader = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  background: ${props => props.theme.colors.gray[50]};
`;

export const TabButton = styled.button`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  border: none;
  background: ${props => props.$active ? props.theme.colors.white : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.primary[600] : props.theme.colors.gray[600]};
  font-weight: ${props => props.$active ? '600' : '400'};
  font-size: ${props => props.theme.fonts.size.sm};
  border-bottom: ${props => props.$active ? `2px solid ${props.theme.colors.primary[600]}` : 'none'};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    color: ${props => props.theme.colors.primary[600]};
    background: ${props => props.$active ? props.theme.colors.white : props.theme.colors.gray[100]};
  }

  &:focus {
    outline: none;
  }
`;

export const EditorToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
  padding: ${props => props.theme.spacing[2]};
  background: ${props => props.theme.colors.gray[50]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  flex-wrap: wrap;
`;

export const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 ${props => props.theme.spacing[2]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  background: transparent;
  color: ${props => props.theme.colors.gray[700]};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: ${props => props.theme.colors.gray[100]};
    color: ${props => props.theme.colors.primary[600]};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary[200]};
  }
`;

export const ToolbarDivider = styled.div`
  width: 1px;
  height: 24px;
  background: ${props => props.theme.colors.gray[300]};
  margin: 0 ${props => props.theme.spacing[1]};
`;

export const EditorContainer = styled.div`
  position: relative;
  width: 100%;

  /* CodeMirror 커스텀 스타일 */
  .cm-editor {
    height: 600px;
    font-size: 14px;
    font-family: 'Courier New', 'Consolas', monospace;
  }

  .cm-scroller {
    overflow: auto;
  }

  .cm-content {
    padding: ${props => props.theme.spacing[4]};
  }

  .cm-line {
    line-height: 1.6;
  }

  /* 문법 강조 색상 커스터마이징 */
  .cm-content .cmt-heading {
    font-weight: bold;
    color: ${props => props.theme.colors.primary[700]};
  }

  .cm-content .cmt-strong {
    font-weight: bold;
  }

  .cm-content .cmt-emphasis {
    font-style: italic;
  }

  .cm-content .cmt-link {
    color: ${props => props.theme.colors.primary[600]};
    text-decoration: underline;
  }

  .cm-content .cmt-monospace {
    background: ${props => props.theme.colors.gray[100]};
    padding: 0.1em 0.3em;
    border-radius: ${props => props.theme.borderRadius.sm};
  }

  /* 스크롤바 스타일 */
  .cm-scroller::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .cm-scroller::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.gray[100]};
  }

  .cm-scroller::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.gray[400]};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.gray[500]};
    }
  }
`;

export const PreviewPane = styled.div`
  padding: ${props => props.theme.spacing[4]};
  overflow-y: auto;
  height: 600px;
  background: ${props => props.theme.colors.white};
  line-height: 1.6;
  color: ${props => props.theme.colors.gray[900]};

  /* 제목 스타일 */
  h1 {
    font-size: 2em;
    font-weight: bold;
    margin-top: 1em;
    margin-bottom: 0.5em;
    line-height: 1.2;
    color: ${props => props.theme.colors.gray[900]};
  }

  h2 {
    font-size: 1.5em;
    font-weight: bold;
    margin-top: 1em;
    margin-bottom: 0.5em;
    line-height: 1.3;
    color: ${props => props.theme.colors.gray[900]};
  }

  h3 {
    font-size: 1.25em;
    font-weight: bold;
    margin-top: 0.8em;
    margin-bottom: 0.4em;
    line-height: 1.4;
    color: ${props => props.theme.colors.gray[900]};
  }

  /* 문단 스타일 */
  p {
    margin: 0.75em 0;
  }

  /* 리스트 스타일 */
  ul, ol {
    padding-left: 1.5em;
    margin: 0.75em 0;
  }

  li {
    margin: 0.25em 0;
  }

  /* 코드 블록 스타일 */
  pre {
    background: ${props => props.theme.colors.gray[900]};
    color: ${props => props.theme.colors.gray[100]};
    border-radius: ${props => props.theme.borderRadius.md};
    padding: ${props => props.theme.spacing[4]};
    margin: 1em 0;
    overflow-x: auto;
    font-family: 'Courier New', 'Consolas', monospace;
    font-size: 0.9em;
    line-height: 1.5;

    code {
      background: none;
      padding: 0;
      color: inherit;
      font-size: inherit;
    }
  }

  /* 인라인 코드 스타일 */
  code {
    background: ${props => props.theme.colors.gray[100]};
    color: ${props => props.theme.colors.primary[700]};
    padding: 0.2em 0.4em;
    border-radius: ${props => props.theme.borderRadius.sm};
    font-family: 'Courier New', 'Consolas', monospace;
    font-size: 0.9em;
  }

  /* 인용구 스타일 */
  blockquote {
    border-left: 4px solid ${props => props.theme.colors.gray[300]};
    padding-left: ${props => props.theme.spacing[4]};
    margin: 1em 0;
    color: ${props => props.theme.colors.gray[600]};
    font-style: italic;
  }

  /* 구분선 스타일 */
  hr {
    border: none;
    border-top: 2px solid ${props => props.theme.colors.gray[200]};
    margin: 2em 0;
  }

  /* 링크 스타일 */
  a {
    color: ${props => props.theme.colors.primary[600]};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  /* 이미지 스타일 */
  img {
    max-width: 100%;
    height: auto;
    border-radius: ${props => props.theme.borderRadius.md};
    margin: 1em 0;
    display: block;
  }

  /* 볼드 스타일 */
  strong {
    font-weight: bold;
  }

  /* 이탤릭 스타일 */
  em {
    font-style: italic;
  }

  /* 취소선 스타일 */
  del {
    text-decoration: line-through;
  }

  /* 테이블 스타일 (GFM) */
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }

  th, td {
    border: 1px solid ${props => props.theme.colors.gray[300]};
    padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
    text-align: left;
  }

  th {
    background: ${props => props.theme.colors.gray[50]};
    font-weight: bold;
  }

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.gray[100]};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.gray[400]};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.gray[500]};
    }
  }
`;

export const UploadIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  border-radius: ${props => props.theme.borderRadius.md};
  z-index: 1000;
  font-size: ${props => props.theme.fonts.size.sm};
  pointer-events: none;
`;
