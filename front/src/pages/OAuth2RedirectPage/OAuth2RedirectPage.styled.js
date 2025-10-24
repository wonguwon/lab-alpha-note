import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const RedirectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

export const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

export const Message = styled.div`
  color: #ffffff;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  max-width: 400px;
  line-height: 1.6;
`;

export const ErrorMessage = styled(Message)`
  color: #fee;
  background: rgba(239, 68, 68, 0.2);
  padding: 16px 24px;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.3);
`;
