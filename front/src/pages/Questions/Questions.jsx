import React from 'react';
import { FiHelpCircle, FiPlus } from 'react-icons/fi';
import Button from '../../components/Button';
import * as S from '../../styles/commonPageStyles';

function Questions() {
  return (
    <S.PageContainer>
      <S.PageHeader>
        <S.PageTitle>
          <FiHelpCircle />
          질문 & 답변
        </S.PageTitle>
        <Button leftIcon={<FiPlus size={18} />}>
          질문하기
        </Button>
      </S.PageHeader>
      
      <S.ContentArea>
        <S.ContentTitle>질문 & 답변 페이지</S.ContentTitle>
        <S.ContentDescription>
          개발 관련 질문을 자유롭게 올려보세요!
        </S.ContentDescription>
      </S.ContentArea>
    </S.PageContainer>
  );
}

export default Questions;