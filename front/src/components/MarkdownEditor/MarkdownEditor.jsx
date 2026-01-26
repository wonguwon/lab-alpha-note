import { useState, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { storageService } from '../../api/services';
import {
  EditorWrapper,
  EditorHeader,
  TabButton,
  EditorToolbar,
  ToolbarButton,
  ToolbarDivider,
  EditorContainer,
  PreviewPane,
  UploadIndicator
} from './MarkdownEditor.styled';

const MarkdownEditor = ({ content = '', onChange, placeholder = '', error }) => {
  const [activeTab, setActiveTab] = useState('edit');
  const [uploading, setUploading] = useState(false);
  const editorViewRef = useRef(null);
  const fileInputRef = useRef(null);

  // 이미지 업로드 핸들러
  const handleImageUpload = async (file) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('이미지 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { uploadUrl, fileUrl } = await storageService.getPresignedUrl(
        fileName,
        file.type,
        'public/editor/images',
        file.size
      );

      await storageService.uploadToS3(uploadUrl, file, file.type);

      // CodeMirror 커서 위치에 이미지 마크다운 삽입
      const imageMarkdown = `\n![${file.name}](${fileUrl})\n`;
      const view = editorViewRef.current;

      if (view) {
        const pos = view.state.selection.main.head;
        view.dispatch({
          changes: { from: pos, insert: imageMarkdown },
          selection: { anchor: pos + imageMarkdown.length }
        });
      } else {
        // fallback: 끝에 추가
        onChange(content + imageMarkdown);
      }
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  // 마크다운 삽입 헬퍼 함수
  const insertMarkdown = (before, after = '') => {
    const view = editorViewRef.current;
    if (!view) return;

    const selection = view.state.selection.main;
    const selectedText = view.state.doc.sliceString(selection.from, selection.to);
    const newText = before + selectedText + after;

    view.dispatch({
      changes: { from: selection.from, to: selection.to, insert: newText },
      selection: {
        anchor: selection.from + before.length + selectedText.length + after.length
      }
    });

    view.focus();
  };

  // 툴바 버튼 핸들러
  const handleBold = () => insertMarkdown('**', '**');
  const handleItalic = () => insertMarkdown('*', '*');
  const handleStrike = () => insertMarkdown('~~', '~~');
  const handleH1 = () => insertMarkdown('# ', '');
  const handleH2 = () => insertMarkdown('## ', '');
  const handleH3 = () => insertMarkdown('### ', '');
  const handleBulletList = () => insertMarkdown('- ', '');
  const handleOrderedList = () => insertMarkdown('1. ', '');
  const handleCodeBlock = () => insertMarkdown('\n```\n', '\n```\n');
  const handleInlineCode = () => insertMarkdown('`', '`');
  const handleBlockquote = () => insertMarkdown('> ', '');
  const handleHr = () => insertMarkdown('\n---\n', '');

  const handleLink = () => {
    const url = window.prompt('링크 URL을 입력하세요:');
    if (url) insertMarkdown('[', `](${url})`);
  };

  const handleImageButton = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    } else if (file) {
      alert('이미지 파일만 업로드 가능합니다.');
    }
    // input 초기화 (같은 파일 재선택 가능하도록)
    e.target.value = '';
  };

  // CodeMirror 확장 - 이미지 붙여넣기/드래그앤드롭
  const pasteExtension = EditorView.domEventHandlers({
    paste: (event) => {
      const items = event.clipboardData?.items;
      if (!items) return false;

      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          event.preventDefault();
          const file = item.getAsFile();
          if (file) handleImageUpload(file);
          return true;
        }
      }
      return false;
    },
    drop: (event) => {
      const files = event.dataTransfer?.files;
      if (!files || files.length === 0) return false;

      const imageFile = Array.from(files).find(f => f.type.startsWith('image/'));
      if (imageFile) {
        event.preventDefault();
        handleImageUpload(imageFile);
        return true;
      }
      return false;
    }
  });

  // ReactMarkdown 코드 블록 컴포넌트
  const CodeBlock = ({ inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={tomorrow}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  return (
    <EditorWrapper $error={error}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <EditorHeader>
        <TabButton
          $active={activeTab === 'edit'}
          onClick={() => setActiveTab('edit')}
          type="button"
        >
          Edit
        </TabButton>
        <TabButton
          $active={activeTab === 'preview'}
          onClick={() => setActiveTab('preview')}
          type="button"
        >
          Preview
        </TabButton>
      </EditorHeader>

      {activeTab === 'edit' ? (
        <>
          <EditorToolbar>
            <ToolbarButton type="button" onClick={handleBold} title="Bold">
              <strong>B</strong>
            </ToolbarButton>
            <ToolbarButton type="button" onClick={handleItalic} title="Italic">
              <em>I</em>
            </ToolbarButton>
            <ToolbarButton type="button" onClick={handleStrike} title="Strikethrough">
              <s>S</s>
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton type="button" onClick={handleH1} title="Heading 1">
              H1
            </ToolbarButton>
            <ToolbarButton type="button" onClick={handleH2} title="Heading 2">
              H2
            </ToolbarButton>
            <ToolbarButton type="button" onClick={handleH3} title="Heading 3">
              H3
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton type="button" onClick={handleBulletList} title="Bullet List">
              •
            </ToolbarButton>
            <ToolbarButton type="button" onClick={handleOrderedList} title="Ordered List">
              1.
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton type="button" onClick={handleCodeBlock} title="Code Block">
              {'</>'}
            </ToolbarButton>
            <ToolbarButton type="button" onClick={handleInlineCode} title="Inline Code">
              {`\``}
            </ToolbarButton>
            <ToolbarButton type="button" onClick={handleBlockquote} title="Blockquote">
              "
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton type="button" onClick={handleLink} title="Insert Link">
              🔗
            </ToolbarButton>
            <ToolbarButton type="button" onClick={handleImageButton} title="Insert Image">
              🖼️
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton type="button" onClick={handleHr} title="Horizontal Rule">
              ―
            </ToolbarButton>
          </EditorToolbar>

          <EditorContainer>
            <CodeMirror
              value={content}
              onChange={(value) => onChange(value)}
              extensions={[markdown(), pasteExtension]}
              onCreateEditor={(view) => {
                editorViewRef.current = view;
              }}
              placeholder={placeholder}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                highlightActiveLine: true,
                foldGutter: true,
              }}
            />
          </EditorContainer>
        </>
      ) : (
        <PreviewPane>
          {content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock
              }}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>
              {placeholder || '프리뷰할 내용이 없습니다.'}
            </div>
          )}
        </PreviewPane>
      )}

      {uploading && (
        <UploadIndicator>
          이미지 업로드 중...
        </UploadIndicator>
      )}
    </EditorWrapper>
  );
};

export default MarkdownEditor;
