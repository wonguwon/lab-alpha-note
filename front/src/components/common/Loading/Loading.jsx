import React from 'react';
import { Spinner, SpinnerContainer, LoadingText, Overlay } from './Loading.styled';

/**
 * 공통 로딩 컴포넌트
 * 
 * @param {string} size - 'small' | 'medium' | 'large' (기본: 'medium')
 * @param {string} text - 로딩 텍스트 (선택)
 * @param {boolean} overlay - 오버레이 표시 여부 (기본: false)
 * @param {string} color - 스피너 색상 (기본: 테마 색상)
 * @param {string} textColor - 텍스트 색상 (기본: gray[600])
 */
const Loading = ({ 
  size = 'medium', 
  text, 
  overlay = false,
  color,
  textColor
}) => {
  const spinner = (
    <SpinnerContainer>
      <Spinner size={size} color={color} />
      {text && <LoadingText $textColor={textColor}>{text}</LoadingText>}
    </SpinnerContainer>
  );

  if (overlay) {
    return <Overlay>{spinner}</Overlay>;
  }

  return spinner;
};

export default Loading;

