import React from 'react';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalFooter,
  ModalButton
} from './Modal.styled';

/**
 * 공통 모달 컴포넌트
 *
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 핸들러
 * @param {string} title - 모달 제목
 * @param {React.ReactNode} children - 모달 본문 내용
 * @param {Array} actions - 하단 버튼 배열 [{ label, onClick, variant, disabled }]
 * @param {boolean} showCloseButton - X 버튼 표시 여부 (기본: true)
 * @param {string} maxWidth - 최대 너비 (기본: 500px)
 * @param {boolean} closeOnOverlayClick - 오버레이 클릭 시 닫기 (기본: true)
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actions = [],
  showCloseButton = true,
  maxWidth = '500px',
  closeOnOverlayClick = true
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer $maxWidth={maxWidth} onClick={(e) => e.stopPropagation()}>
        {title && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            {showCloseButton && (
              <CloseButton onClick={onClose} aria-label="닫기">
                ×
              </CloseButton>
            )}
          </ModalHeader>
        )}

        <ModalBody>{children}</ModalBody>

        {actions.length > 0 && (
          <ModalFooter>
            {actions.map((action, index) => (
              <ModalButton
                key={index}
                onClick={action.onClick}
                $variant={action.variant || 'default'}
                disabled={action.disabled}
              >
                {action.label}
              </ModalButton>
            ))}
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;
