import React from 'react';
import { FiUsers, FiEdit3 } from 'react-icons/fi';
import Button from '../../components/Button';
import * as S from '../../styles/commonPageStyles';

function Community() {
  return (
    <S.PageContainer>
      <S.PageHeader>
        <S.PageTitle>
          <FiUsers />
          커뮤니티
        </S.PageTitle>
        <Button variant="success" leftIcon={<FiEdit3 size={18} />}>
          글쓰기
        </Button>
      </S.PageHeader>
      
      <S.ContentArea>
        <S.ContentTitle>커뮤니티 페이지</S.ContentTitle>
        <S.ContentDescription>
          개발자들과 소통하고 정보를 공유해보세요!
        </S.ContentDescription>
      </S.ContentArea>
    </S.PageContainer>
  );
}

export default Community;