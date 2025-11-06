import React from 'react';

const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '500px',
          maxHeight: '70vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>계정 및 서비스 이용약관</h2>
        <div style={{ marginBottom: '1rem', lineHeight: 1.6, color: '#666' }}>
          <p><strong>제1조 (목적)</strong><br />
          이 약관은 AlphaNote(이하 "회사")가 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>

          <p><strong>제2조 (서비스의 제공)</strong><br />
          회사는 이용자에게 성장 기록 및 관리 서비스를 제공합니다.</p>

          <p><strong>제3조 (개인정보보호)</strong><br />
          회사는 이용자의 개인정보를 소중히 여기며 관련 법령에 따라 보호합니다.</p>

          <p><strong>제4조 (서비스 이용의 제한)</strong><br />
          회사는 이용자가 본 약관을 위반하거나 서비스의 정상적인 운영을 방해하는 경우 서비스 이용을 제한할 수 있습니다.</p>
        </div>
        <button
          onClick={onClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default TermsModal;
