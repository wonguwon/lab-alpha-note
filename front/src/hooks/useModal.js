import { useState, useCallback } from 'react';

/**
 * 모달 상태 관리를 위한 Hook
 *
 * @returns {object} - { isOpen, openModal, closeModal, modalProps, setModalProps }
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});

  const openModal = useCallback((props = {}) => {
    setModalProps(props);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // 애니메이션을 위해 약간의 딜레이 후 props 초기화
    setTimeout(() => setModalProps({}), 200);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    modalProps,
    setModalProps
  };
};

/**
 * Alert 전용 Hook
 *
 * @returns {object} - { showAlert, AlertComponent }
 */
export const useAlert = () => {
  const { isOpen, openModal, closeModal, modalProps } = useModal();

  const showAlert = useCallback((message, options = {}) => {
    openModal({
      message,
      title: options.title || '알림',
      confirmText: options.confirmText || '확인',
      variant: options.variant || 'primary',
      onConfirm: options.onConfirm,
      onClose: options.onClose
    });
  }, [openModal]);

  const handleClose = useCallback(() => {
    if (modalProps.onConfirm) {
      modalProps.onConfirm();
    }
    if (modalProps.onClose) {
      modalProps.onClose();
    }
    closeModal();
  }, [closeModal, modalProps]);

  return {
    isOpen,
    showAlert,
    closeAlert: closeModal,
    alertProps: { ...modalProps, onClose: handleClose }
  };
};

/**
 * Confirm 전용 Hook
 *
 * @returns {object} - { showConfirm, ConfirmComponent }
 */
export const useConfirm = () => {
  const { isOpen, openModal, closeModal, modalProps, setModalProps } = useModal();

  const showConfirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      openModal({
        message,
        title: options.title || '확인',
        confirmText: options.confirmText || '확인',
        cancelText: options.cancelText || '취소',
        variant: options.variant || 'primary',
        resolve
      });
    });
  }, [openModal]);

  const handleConfirm = useCallback(async () => {
    if (modalProps.resolve) {
      const result = modalProps.onConfirm ? await modalProps.onConfirm() : true;
      modalProps.resolve(result);
    }
    closeModal();
  }, [closeModal, modalProps]);

  const handleCancel = useCallback(() => {
    if (modalProps.resolve) {
      modalProps.resolve(false);
    }
    closeModal();
  }, [closeModal, modalProps]);

  return {
    isOpen,
    showConfirm,
    confirmProps: {
      ...modalProps,
      onConfirm: handleConfirm,
      onCancel: handleCancel
    }
  };
};

export default useModal;
