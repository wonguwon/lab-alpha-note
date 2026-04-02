import styled from 'styled-components';

export const RedirectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 20px;
`;

export const Message = styled.div`
  color: #374151;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  max-width: 400px;
  line-height: 1.6;
`;

export const ErrorMessage = styled(Message)`
  color: #dc2626;
  background: rgba(239, 68, 68, 0.15);
  padding: 16px 24px;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  margin-bottom: 24px;
`;

export const RecoveryButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.2);

  &:hover {
    background: #5a6fd6;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

export const SecondaryButton = styled(RecoveryButton)`
  background: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
    color: #1f2937;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

