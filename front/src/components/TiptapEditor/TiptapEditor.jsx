import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import { common, createLowlight } from 'lowlight';
import { storageService } from '../../api/services';
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatStrikethrough,
  MdCode,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdLink,
  MdFormatQuote,
  MdHorizontalRule,
  MdUndo,
  MdRedo,
  MdImage
} from 'react-icons/md';
import { BiCodeBlock } from 'react-icons/bi';
import { LuHeading1, LuHeading2, LuHeading3 } from 'react-icons/lu';
import {
  EditorContainer,
  MenuBar,
  MenuButton,
  MenuDivider,
  EditorWrapper,
  HiddenFileInput,
  ImageResizeMenu,
  SizeButton,
} from './TiptapEditor.styled';

const lowlight = createLowlight(common);

const TiptapEditor = ({ content, onChange, placeholder = '내용을 입력하세요...', error }) => {
  const fileInputRef = React.useRef(null);
  const editorWrapperRef = React.useRef(null);
  const [uploading, setUploading] = useState(false);
  const [showResizeMenu, setShowResizeMenu] = useState(false);
  const [resizeMenuPosition, setResizeMenuPosition] = useState({ top: 0, left: 0 });
  const [currentImageWidth, setCurrentImageWidth] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Use CodeBlockLowlight instead
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'editor-image',
        },
      }).extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            width: {
              default: null,
              parseHTML: element => element.getAttribute('width'),
              renderHTML: attributes => {
                if (!attributes.width) {
                  return {};
                }
                return { width: attributes.width };
              },
            },
          };
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Handle image clicks to show resize menu
  React.useEffect(() => {
    if (!editor) return;

    const handleClick = (event) => {
      const target = event.target;

      // Check if clicked element is an image in the editor
      if (target.tagName === 'IMG' && target.closest('.ProseMirror')) {
        event.preventDefault();

        // Get the image's current width
        const currentWidth = target.getAttribute('width');
        setCurrentImageWidth(currentWidth);

        // Calculate position for the resize menu
        const rect = target.getBoundingClientRect();
        const editorWrapper = editorWrapperRef.current?.getBoundingClientRect();

        if (editorWrapper) {
          // Position the menu at the top-left of the image as a popup overlay
          setResizeMenuPosition({
            top: rect.top - editorWrapper.top,
            left: rect.left - editorWrapper.left,
          });
        }

        setShowResizeMenu(true);
      } else if (!event.target.closest('[data-resize-menu]')) {
        // Close menu if clicking outside
        setShowResizeMenu(false);
      }
    };

    const editorElement = editorWrapperRef.current;
    if (editorElement) {
      editorElement.addEventListener('click', handleClick);
      return () => {
        editorElement.removeEventListener('click', handleClick);
      };
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const handleImageResize = (width) => {
    if (!editor) return;

    editor
      .chain()
      .focus()
      .updateAttributes('image', { width: width === '100%' ? null : width })
      .run();

    setCurrentImageWidth(width === '100%' ? null : width);
    setShowResizeMenu(false);
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL을 입력하세요:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    if (uploading) return;
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 크기는 5MB 이하여야 합니다.');
      return;
    }

    try {
      setUploading(true);

      // 1. Presigned URL 발급
      const { uploadUrl, fileUrl } = await storageService.getPresignedUrl(
        file.name,
        file.type,
        'public/qna'
      );

      // 2. S3에 파일 업로드
      await storageService.uploadToS3(uploadUrl, file, file.type);

      // 3. 에디터에 이미지 삽입
      editor.chain().focus().setImage({ src: fileUrl }).run();
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setUploading(false);
      // input 초기화
      event.target.value = '';
    }
  };

  return (
    <EditorContainer $error={error}>
      <MenuBar>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          $active={editor.isActive('bold')}
          type="button"
          title="Bold"
        >
          <MdFormatBold />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          $active={editor.isActive('italic')}
          type="button"
          title="Italic"
        >
          <MdFormatItalic />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          $active={editor.isActive('strike')}
          type="button"
          title="Strikethrough"
        >
          <MdFormatStrikethrough />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          $active={editor.isActive('code')}
          type="button"
          title="Inline Code"
        >
          <MdCode />
        </MenuButton>

        <MenuDivider />

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          $active={editor.isActive('heading', { level: 1 })}
          type="button"
          title="Heading 1"
        >
          <LuHeading1 />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          $active={editor.isActive('heading', { level: 2 })}
          type="button"
          title="Heading 2"
        >
          <LuHeading2 />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          $active={editor.isActive('heading', { level: 3 })}
          type="button"
          title="Heading 3"
        >
          <LuHeading3 />
        </MenuButton>

        <MenuDivider />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          $active={editor.isActive('bulletList')}
          type="button"
          title="Bullet List"
        >
          <MdFormatListBulleted />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          $active={editor.isActive('orderedList')}
          type="button"
          title="Numbered List"
        >
          <MdFormatListNumbered />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          $active={editor.isActive('codeBlock')}
          type="button"
          title="Code Block"
        >
          <BiCodeBlock />
        </MenuButton>

        <MenuDivider />

        <MenuButton
          onClick={setLink}
          $active={editor.isActive('link')}
          type="button"
          title="Link"
        >
          <MdLink />
        </MenuButton>
        <MenuButton
          onClick={addImage}
          type="button"
          title="Image"
          disabled={uploading}
        >
          {uploading ? '...' : <MdImage />}
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          $active={editor.isActive('blockquote')}
          type="button"
          title="Quote"
        >
          <MdFormatQuote />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          type="button"
          title="Horizontal Rule"
        >
          <MdHorizontalRule />
        </MenuButton>

        <MenuDivider />

        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          type="button"
          title="Undo"
        >
          <MdUndo />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          type="button"
          title="Redo"
        >
          <MdRedo />
        </MenuButton>
      </MenuBar>

      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />

      <EditorWrapper ref={editorWrapperRef}>
        <EditorContent editor={editor} />

        {/* Image Resize Menu */}
        {showResizeMenu && (
          <ImageResizeMenu
            data-resize-menu
            $top={resizeMenuPosition.top}
            $left={resizeMenuPosition.left}
          >
            <SizeButton
              onClick={() => handleImageResize('25%')}
              $active={currentImageWidth === '25%'}
            >
              25%
            </SizeButton>
            <SizeButton
              onClick={() => handleImageResize('50%')}
              $active={currentImageWidth === '50%'}
            >
              50%
            </SizeButton>
            <SizeButton
              onClick={() => handleImageResize('75%')}
              $active={currentImageWidth === '75%'}
            >
              75%
            </SizeButton>
            <SizeButton
              onClick={() => handleImageResize('100%')}
              $active={!currentImageWidth || currentImageWidth === '100%'}
            >
              100%
            </SizeButton>
          </ImageResizeMenu>
        )}
      </EditorWrapper>
    </EditorContainer>
  );
};

export default TiptapEditor;
