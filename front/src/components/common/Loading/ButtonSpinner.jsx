import React from 'react';
import { ButtonSpinnerContainer } from './Loading.styled';

/**
 * 버튼 내부용 작은 로딩 스피너
 * 버튼 텍스트 옆에 표시되는 작은 스피너
 */
const ButtonSpinner = ({ size = 'small', color }) => {
  return (
    <ButtonSpinnerContainer size={size} color={color}>
      <div className="spinner-dot"></div>
      <div className="spinner-dot"></div>
      <div className="spinner-dot"></div>
    </ButtonSpinnerContainer>
  );
};

export default ButtonSpinner;

