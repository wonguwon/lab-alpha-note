import React from 'react';
import { FiBook, FiPlus } from 'react-icons/fi';
import Button from '../../components/Button';
import * as S from '../../styles/commonPageStyles';

function Knowledge() {
  return (
    <S.PageContainer>
      <S.PageHeader>
        <S.PageTitle>
          <FiBook />
          지식
        </S.PageTitle>
        <Button 
          variant="outline" 
          leftIcon={<FiPlus size={18} />}
          style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}
        >
          지식 공유
        </Button>
      </S.PageHeader>
      
      <S.ContentArea>
        <S.ContentTitle>지식 페이지</S.ContentTitle>
        <S.ContentDescription>
          유용한 개발 지식을 정리하고 공유해보세요!
        </S.ContentDescription>
      </S.ContentArea>
    </S.PageContainer>
  );
}

export default Knowledge;