import React from 'react';
import Modal from './Modal';

/**
 * Alert 컴포넌트 - alert() 대체용
 *
 * @param {boolean} isOpen - 표시 여부
 * @param {function} onClose - 닫기 핸들러
 * @param {string} title - 제목 (기본: "알림")
 * @param {string|React.ReactNode} message - 메시지
 * @param {string} confirmText - 확인 버튼 텍스트 (기본: "확인")
 * @param {string} variant - 버튼 스타일 (success|warning|danger|primary)
 */
const Alert = ({
  isOpen,
  onClose,
  title = '알림',
  message,
  confirmText = '확인',
  variant = 'primary'
}) => {
  const actions = [
    {
      label: confirmText,
      onClick: onClose,
      variant: variant
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      actions={actions}
      maxWidth="400px"
      closeOnOverlayClick={false}
      showCloseButton={false}
    >
      <div style={{ fontSize: '0.9375rem', lineHeight: '1.6', color: '#4b5563' }}>
        {message}
      </div>
    </Modal>
  );
};

export default Alert;
