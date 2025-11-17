import React from 'react';
import {
  PolicyContainer,
  PolicyHeader,
  PolicyTitle,
  PolicySubtitle,
  PolicyDate,
  PolicyContent,
  PolicyIntro,
  Section,
  SectionTitle,
  SubsectionTitle,
  SubsectionSubtitle,
  Paragraph,
  List,
  ListItem,
  ContactBox,
  ContactTitle,
  ContactInfo,
  ExternalLinks,
  ExternalLinkItem
} from './PrivacyPolicyPage.styled';

const PrivacyPolicyPage = () => {
  return (
    <PolicyContainer>
      <PolicyHeader>
        <PolicyTitle>개인정보 처리방침</PolicyTitle>
        <PolicySubtitle>Alpha Note</PolicySubtitle>
        <PolicyDate>
          <span>최종 업데이트: 2025. 11. 17</span>
          <span>시행일자: 2025. 11. 17</span>
        </PolicyDate>
      </PolicyHeader>

      <PolicyContent>
        <PolicyIntro>
          Alpha Note(이하 "회사" 또는 "서비스")는 「개인정보보호법」 등 관련 법령을 준수하며, 이용자의 개인정보를 소중하게 보호하기 위해 다음과 같은 개인정보 처리방침을 수립·공개합니다. 본 방침은 Alpha Note 웹사이트 및 회사가 제공하는 관련 서비스에 공통으로 적용됩니다.
        </PolicyIntro>

        <Section>
          <SectionTitle>제1조 (수집하는 개인정보 항목 및 수집 방법)</SectionTitle>

          <SubsectionTitle>회원가입 시 수집하는 정보</SubsectionTitle>

          <SubsectionSubtitle>필수</SubsectionSubtitle>
          <List>
            <ListItem>이메일 주소</ListItem>
            <ListItem>비밀번호</ListItem>
            <ListItem>닉네임(미입력 시 자동 생성 아이디 사용)</ListItem>
          </List>

          <SubsectionSubtitle>선택</SubsectionSubtitle>
          <List>
            <ListItem>프로필 이미지</ListItem>
            <ListItem>한 줄 소개, 기타 프로필 정보</ListItem>
          </List>

          <SubsectionTitle>소셜 로그인을 이용하는 경우</SubsectionTitle>
          <Paragraph>
            회사는 이용자가 선택한 소셜 로그인 제공자가 Alpha Note에 제공하는 최소한의 정보만을 수집합니다.
          </Paragraph>

          <SubsectionSubtitle>공통적으로 수집될 수 있는 항목(제공자에 따라 일부 상이할 수 있음)</SubsectionSubtitle>
          <List>
            <ListItem>이메일 주소</ListItem>
            <ListItem>이름 또는 닉네임</ListItem>
            <ListItem>프로필 이미지(선택 제공인 경우 선택 수집)</ListItem>
          </List>

          <SubsectionTitle>서비스 이용 과정에서 자동으로 수집되는 정보</SubsectionTitle>
          <List>
            <ListItem>IP 주소</ListItem>
            <ListItem>쿠키, 서비스 이용 기록(접속 일시, 접속 로그, 요청 URL 등)</ListItem>
            <ListItem>브라우저 정보, 운영체제, 기기 정보(모바일/PC 구분 등)</ListItem>
            <ListItem>오류 로그, 비정상 사용 행위에 대한 기록</ListItem>
          </List>

          <SubsectionTitle>문의/신고 처리 시 수집되는 정보</SubsectionTitle>
          <List>
            <ListItem>이메일 주소</ListItem>
            <ListItem>문의/신고 내용 및 첨부 자료</ListItem>
          </List>

          <SubsectionTitle>수집 방법</SubsectionTitle>
          <List>
            <ListItem>회원가입, 로그인, 프로필 설정, 질문/답변/댓글 작성 등 서비스 이용 과정에서 이용자가 직접 입력</ListItem>
            <ListItem>서비스 이용 중 자동으로 생성·수집되는 정보(서버 로그, 쿠키 등)</ListItem>
            <ListItem>문의하기/신고하기 등 기능을 통한 이용자의 자발적 제공</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>제2조 (개인정보의 처리 목적)</SectionTitle>
          <Paragraph>
            회사는 수집한 개인정보를 다음의 목적을 위해 이용합니다.
          </Paragraph>

          <SubsectionTitle>회원 관리</SubsectionTitle>
          <List>
            <ListItem>회원 가입 의사 확인, 본인 식별·인증</ListItem>
            <ListItem>계정 관리, 비밀번호 찾기 및 보안 알림</ListItem>
            <ListItem>부정 가입 및 부정 사용 방지, 서비스 이용 제한 조치</ListItem>
          </List>

          <SubsectionTitle>서비스 제공 및 운영</SubsectionTitle>
          <List>
            <ListItem>질문, 답변, 댓글, 투표 등 Alpha Note의 기본 기능 제공</ListItem>
            <ListItem>알림 발송, 북마크/스크랩 등 편의 기능 제공</ListItem>
            <ListItem>서비스 장애 대응 및 오류 로그 분석</ListItem>
          </List>

          <SubsectionTitle>서비스 개선 및 통계 분석</SubsectionTitle>
          <List>
            <ListItem>서비스 이용 패턴 분석, 인기 컨텐츠·태그 통계</ListItem>
            <ListItem>검색 품질 향상, 기능 개선 및 신규 기능 개발</ListItem>
          </List>

          <SubsectionTitle>보안 및 법적 의무 이행</SubsectionTitle>
          <List>
            <ListItem>해킹, 스팸, 어뷰징, 불법 행위 탐지 및 차단</ListItem>
            <ListItem>분쟁 해결, 민원 처리, 법령상 의무 준수</ListItem>
          </List>

          <Paragraph>
            회사는 위 목적 외의 용도로 개인정보를 이용하지 않으며, 이용 목적이 변경되는 경우 사전에 별도의 동의를 받습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제3조 (개인정보의 보유 및 이용 기간)</SectionTitle>

          <SubsectionTitle>기본 원칙</SubsectionTitle>
          <Paragraph>
            회사는 개인정보의 수집 및 이용 목적이 달성된 후 또는 이용자가 회원 탈퇴를 요청한 경우 지체 없이 해당 정보를 파기합니다.
          </Paragraph>

          <SubsectionTitle>내부 방침에 따른 보관</SubsectionTitle>
          <Paragraph>
            아래 정보는 부정 이용 방지 및 분쟁 대응을 위해 일정 기간 보관될 수 있습니다.
          </Paragraph>
          <List>
            <ListItem>부정 이용 기록, 접속 로그: 최대 1년 이내 보관</ListItem>
          </List>

          <SubsectionTitle>법령에 따른 보관</SubsectionTitle>
          <Paragraph>
            회사는 다음과 같이 관련 법령에 따라 개인정보를 보관할 수 있습니다.
          </Paragraph>
          <List>
            <ListItem>통신비밀보호법에 따른 접속 기록: 3개월</ListItem>
            <ListItem>그 밖에 법령에서 정하는 경우 해당 법령에서 정한 기간 동안 보관</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>제4조 (개인정보의 제3자 제공)</SectionTitle>

          <SubsectionTitle>기본 원칙</SubsectionTitle>
          <Paragraph>
            회사는 이용자의 사전 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
          </Paragraph>

          <SubsectionTitle>예외 사항</SubsectionTitle>
          <Paragraph>
            다음의 경우에는 예외적으로 개인정보를 제공할 수 있습니다.
          </Paragraph>
          <List>
            <ListItem>이용자가 사전에 제3자 제공에 동의한 경우</ListItem>
            <ListItem>법령에 근거하여 수사기관, 감독기관 등이 적법한 절차에 따라 요청하는 경우</ListItem>
            <ListItem>사람의 생명, 신체, 재산에 대한 급박한 위해를 방지하기 위하여 필요한 경우</ListItem>
          </List>

          <SubsectionTitle>현재 제3자 제공 현황</SubsectionTitle>
          <Paragraph>
            현재 Alpha Note는 상기 예외 사유를 제외하고, 이용자의 개인정보를 제3자에게 제공하지 않습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제5조 (개인정보 처리의 위탁)</SectionTitle>
          <Paragraph>
            회사는 원활한 서비스 제공을 위하여 개인정보 처리 업무를 외부 업체에 위탁할 수 있으며, 위탁 시 관련 법령에 따라 개인정보가 안전하게 처리되도록 관리·감독합니다.
          </Paragraph>

          <SubsectionTitle>현재 위탁 현황</SubsectionTitle>
          <Paragraph>
            현재 Alpha Note는 개인정보 처리 업무를 외부 업체에 별도로 위탁하고 있지 않습니다.
          </Paragraph>
          <Paragraph>
            향후 위탁이 발생할 경우, 위탁받는 자와 위탁 업무 내용, 보유 및 이용 기간 등을 본 방침 또는 공지사항을 통해 안내하겠습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제6조 (이용자의 권리와 행사 방법)</SectionTitle>
          <Paragraph>
            이용자는 언제든지 Alpha Note에 대해 다음과 같은 권리를 행사할 수 있습니다.
          </Paragraph>
          <List>
            <ListItem>자신의 개인정보 열람 요청</ListItem>
            <ListItem>개인정보 정정·삭제 요청</ListItem>
            <ListItem>개인정보 처리 정지 요청</ListItem>
            <ListItem>회원 탈퇴 및 동의 철회</ListItem>
          </List>

          <SubsectionTitle>권리 행사는 다음의 방법으로 가능합니다.</SubsectionTitle>
          <List>
            <ListItem>서비스 내 "마이페이지" 등에서 개인정보 조회·수정</ListItem>
            <ListItem>회원 탈퇴 메뉴를 통한 탈퇴 신청</ListItem>
            <ListItem>이메일 등으로 회사에 직접 요청</ListItem>
          </List>

          <Paragraph>
            이용자가 개인정보의 정정 또는 삭제를 요청한 경우 회사는 이를 지체 없이 처리하며, 정정·삭제가 완료되기 전까지 해당 개인정보를 이용하거나 제3자에게 제공하지 않습니다.
          </Paragraph>
          <Paragraph>
            법령에서 그 개인정보를 보존하도록 정하고 있는 경우, 이용자의 삭제 요청이 있더라도 해당 법령에서 정한 기간 동안은 보관할 수 있습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제7조 (질문·답변 등 컨텐츠와 개인정보의 분리)</SectionTitle>
          <Paragraph>
            회원이 Alpha Note에 작성한 질문, 답변, 댓글 및 기타 게시물(이하 "컨텐츠")은 지식 공유와 커뮤니티 운영을 위해 서비스에 계속 남을 수 있습니다.
          </Paragraph>
          <Paragraph>
            회원이 탈퇴하거나 개인정보가 삭제되는 경우, 계정과 직접적으로 연관된 식별 정보는 삭제 또는 익명화되며, 컨텐츠에는 작성자를 식별할 수 없는 형태의 닉네임 또는 익명 표시만 남게 됩니다.
          </Paragraph>
          <Paragraph>
            개인정보 삭제 또는 회원 탈퇴 후에는 특정 컨텐츠의 작성자를 다시 식별하기 어려우므로, 컨텐츠까지 함께 삭제되기를 원하는 경우 회원 탈퇴 전에 직접 컨텐츠 삭제를 진행해야 합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제8조 (쿠키(Cookie) 및 자동 수집 장치의 운영)</SectionTitle>
          <Paragraph>
            회사는 이용자의 편의와 서비스 품질 향상을 위하여 쿠키를 사용할 수 있습니다.
          </Paragraph>

          <SubsectionTitle>쿠키의 사용 목적</SubsectionTitle>
          <List>
            <ListItem>로그인 상태 유지 및 인증</ListItem>
            <ListItem>접속 빈도, 방문 시간, 서비스 이용 형태 등의 분석</ListItem>
            <ListItem>서비스 개선 및 편의 기능 제공</ListItem>
          </List>

          <Paragraph>
            이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나, 저장될 때마다 확인할 수 있습니다.
          </Paragraph>
          <Paragraph>
            다만, 쿠키 저장을 거부할 경우 로그인 등 일부 서비스 이용에 제한이 발생할 수 있습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제9조 (개인정보의 파기 절차 및 방법)</SectionTitle>

          <SubsectionTitle>파기 절차</SubsectionTitle>
          <Paragraph>
            개인정보의 보유 기간이 경과하거나 처리 목적이 달성된 경우, 해당 정보를 별도의 DB로 옮겨 법령에 따른 보존이 필요한 경우가 아니면 지체 없이 파기합니다.
          </Paragraph>
          <Paragraph>
            이때 별도 DB로 옮겨진 개인정보는 법령에 의한 경우가 아니고서는 다른 목적으로 이용하지 않습니다.
          </Paragraph>

          <SubsectionTitle>파기 방법</SubsectionTitle>
          <List>
            <ListItem>전자적 파일 형태: 복구·재생이 불가능한 방법으로 영구 삭제</ListItem>
            <ListItem>종이 문서: 분쇄하거나 소각하여 파기</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>제10조 (개인정보의 안전성 확보 조치)</SectionTitle>
          <Paragraph>
            회사는 개인정보의 안전성을 확보하기 위하여 다음과 같은 조치를 취하고 있습니다.
          </Paragraph>

          <SubsectionTitle>접근 권한 관리</SubsectionTitle>
          <List>
            <ListItem>개인정보에 대한 접근 권한을 최소한의 인원으로 제한</ListItem>
            <ListItem>계정 및 비밀번호 관리, 권한 변경·말소 등 기록 관리</ListItem>
          </List>

          <SubsectionTitle>비밀번호 및 중요 정보 암호화</SubsectionTitle>
          <List>
            <ListItem>비밀번호는 일방향 암호화 방식으로 저장</ListItem>
            <ListItem>중요한 데이터 전송 시 암호화 통신(HTTPS 등) 적용</ListItem>
          </List>

          <SubsectionTitle>보안 프로그램 운영</SubsectionTitle>
          <List>
            <ListItem>서버 및 애플리케이션에 보안 패치 적용</ListItem>
            <ListItem>이상 트래픽 및 공격 패턴 모니터링</ListItem>
          </List>

          <SubsectionTitle>관리적 보호 조치</SubsectionTitle>
          <List>
            <ListItem>개인정보 보호에 대한 내부 지침 마련</ListItem>
            <ListItem>개인정보 처리에 대한 교육 및 점검</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>제11조 (개인정보 보호책임자 및 문의처)</SectionTitle>
          <Paragraph>
            회사는 개인정보 처리와 관련한 이용자의 불만 처리, 피해 구제 및 상담을 위하여 다음과 같이 개인정보 보호책임자를 지정하고 있습니다.
          </Paragraph>

          <ContactBox>
            <ContactTitle>개인정보 보호책임자</ContactTitle>
            <ContactInfo>
              <p>이름: [이름]</p>
              <p>이메일: <a href="mailto:[이메일 주소]">[이메일 주소]</a></p>
            </ContactInfo>
          </ContactBox>

          <Paragraph>
            이용자는 Alpha Note 서비스를 이용하면서 발생한 개인정보 보호 관련 문의, 불만 처리, 피해 구제 등에 관한 사항을 위 책임자에게 문의할 수 있으며, 회사는 이에 대해 지체 없이 답변 및 처리하겠습니다.
          </Paragraph>

          <Paragraph>
            또한, 개인정보 침해에 대한 신고나 상담이 필요한 경우 다음 기관에 문의할 수 있습니다.
          </Paragraph>

          <ContactBox>
            <ContactTitle>개인정보 관련 외부 기관</ContactTitle>
            <ExternalLinks>
              <ExternalLinkItem>
                개인정보침해신고센터: <a href="https://privacy.kisa.or.kr" target="_blank" rel="noopener noreferrer">privacy.kisa.or.kr</a> / 국번없이 118
              </ExternalLinkItem>
              <ExternalLinkItem>
                개인정보분쟁조정위원회: <a href="https://www.kopico.go.kr" target="_blank" rel="noopener noreferrer">www.kopico.go.kr</a> / 국번없이 1833-6972
              </ExternalLinkItem>
              <ExternalLinkItem>
                대검찰청 사이버범죄수사단: <a href="https://www.spo.go.kr" target="_blank" rel="noopener noreferrer">www.spo.go.kr</a> / 국번없이 1301
              </ExternalLinkItem>
              <ExternalLinkItem>
                경찰청 사이버수사국: <a href="https://ecrm.cyber.go.kr" target="_blank" rel="noopener noreferrer">ecrm.cyber.go.kr</a> / 국번없이 182
              </ExternalLinkItem>
            </ExternalLinks>
          </ContactBox>
        </Section>

        <Section>
          <SectionTitle>제12조 (개인정보 처리방침의 변경)</SectionTitle>
          <Paragraph>
            이 개인정보 처리방침은 시행일자부터 적용됩니다.
          </Paragraph>
          <Paragraph>
            법령, 정책, 서비스 내용의 변경에 따라 본 방침이 변경되는 경우, 회사는 변경 최소 7일 전부터 Alpha Note 내 공지사항 등을 통해 변경 내용과 시행일자를 공지합니다.
          </Paragraph>
          <Paragraph>
            이용자 권리에 중대한 변경이 있을 경우에는 최소 30일 전에 공지합니다.
          </Paragraph>
        </Section>
      </PolicyContent>
    </PolicyContainer>
  );
};

export default PrivacyPolicyPage;
