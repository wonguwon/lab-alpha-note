import React from 'react';
import { FiBell } from 'react-icons/fi';
import * as S from '../../styles/commonPageStyles';

function Notice() {
  return (
    <S.PageContainer>
      <S.PageHeader>
        <S.PageTitle>
          <FiBell style={{ color: '#f59e0b' }} />
          공지사항
        </S.PageTitle>
      </S.PageHeader>
      
      <S.ContentArea>
        <S.ContentTitle>공지사항 페이지</S.ContentTitle>
        <S.ContentDescription>
          중요한 공지사항을 확인하세요!
        </S.ContentDescription>
      </S.ContentArea>
    </S.PageContainer>
  );
}

export default Notice;