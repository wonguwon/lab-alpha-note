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
`;
