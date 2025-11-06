import React from 'react';

const PrivacyModal = ({ isOpen, onClose }) => {
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
        <h2>개인정보 처리방침</h2>
        <div style={{ marginBottom: '1rem', lineHeight: 1.6, color: '#666' }}>
          <p><strong>1. 개인정보의 수집 및 이용목적</strong><br />
          AlphaNote는 다음의 목적을 위해 개인정보를 수집 및 이용합니다.<br />
          - 서비스 제공 및 관리<br />
          - 회원 식별 및 인증<br />
          - 고객 상담 및 지원</p>

          <p><strong>2. 수집하는 개인정보 항목</strong><br />
          - 필수항목: 이메일, 비밀번호, 닉네임<br />
          - 선택항목: 마케팅 수신 동의</p>

          <p><strong>3. 개인정보의 보유 및 이용기간</strong><br />
          회원 탈퇴 시까지 보유하며, 탈퇴 후 즉시 삭제합니다.</p>

          <p><strong>4. 개인정보의 제3자 제공</strong><br />
          회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다.</p>
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

export default PrivacyModal;
