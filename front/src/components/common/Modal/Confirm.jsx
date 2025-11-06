import React from 'react';
import Modal from './Modal';

/**
 * Confirm 컴포넌트 - confirm() 대체용
 *
 * @param {boolean} isOpen - 표시 여부
 * @param {function} onConfirm - 확인 클릭 핸들러
 * @param {function} onCancel - 취소 클릭 핸들러
 * @param {string} title - 제목 (기본: "확인")
 * @param {string|React.ReactNode} message - 메시지
 * @param {string} confirmText - 확인 버튼 텍스트 (기본: "확인")
 * @param {string} cancelText - 취소 버튼 텍스트 (기본: "취소")
 * @param {string} variant - 확인 버튼 스타일 (danger|warning|success|primary)
 * @param {boolean} isLoading - 로딩 상태
 */
const Confirm = ({
  isOpen,
  onConfirm,
  onCancel,
  title = '확인',
  message,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'primary',
  isLoading = false
}) => {
  const actions = [
    {
      label: cancelText,
      onClick: onCancel,
      variant: 'default',
      disabled: isLoading
    },
    {
      label: isLoading ? '처리 중...' : confirmText,
      onClick: onConfirm,
      variant: variant,
      disabled: isLoading
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      actions={actions}
      maxWidth="400px"
      closeOnOverlayClick={!isLoading}
      showCloseButton={false}
    >
      <div style={{ fontSize: '0.9375rem', lineHeight: '1.6', color: '#4b5563' }}>
        {message}
      </div>
    </Modal>
  );
};

export default Confirm;
