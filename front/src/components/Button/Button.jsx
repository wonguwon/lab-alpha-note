import React from 'react';
import * as S from './Button.styled';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  fullWidth = false,
  ...props 
}) => {
  return (
    <S.Button
      variant={variant}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      {...props}
    >
      {leftIcon && <S.Icon position="left">{leftIcon}</S.Icon>}
      {children}
      {rightIcon && <S.Icon position="right">{rightIcon}</S.Icon>}
    </S.Button>
  );
};

export default Button;