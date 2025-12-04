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
  Paragraph,
  List,
  ListItem
} from '../PrivacyPolicyPage/PrivacyPolicyPage.styled';

const TermsPage = () => {
  return (
    <PolicyContainer>
      <PolicyHeader>
        <PolicyTitle>서비스 이용약관</PolicyTitle>
        <PolicySubtitle>AlphaNote</PolicySubtitle>
        <PolicyDate>
          <span>최종 업데이트: 2025. 01. 03</span>
          <span>시행일자: 2025. 01. 10</span>
        </PolicyDate>
      </PolicyHeader>

      <PolicyContent>
        <PolicyIntro>
          AlphaNote를 찾아주셔서 감사합니다.
          AlphaNote를 방문하신 여러분을 환영합니다. 이 약관은 AlphaNote(이하 "회사")가 제공하는 서비스를 회원 또는 비회원 이용자가 보다 효과적이고 안전하게 누리는데 도움이 되는 정보를 담고 있습니다.
          <br /><br />
          여러분이 AlphaNote의 서비스를 이용하거나 회원으로 가입하게 될 경우, 여러분은 이 약관과 각 서비스의 운영 규정을 확인하거나 동의하게 되므로 시간을 내어 신중하게 읽어주시기 바랍니다.
        </PolicyIntro>

        <Section>
          <SectionTitle>제1조 (목적)</SectionTitle>
          <Paragraph>
            이 약관은 AlphaNote(이하 "회사")가 제공하는 습관 추적(Habit Tracking) 및 Q&A 커뮤니티 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제2조 (서비스의 제공)</SectionTitle>
          <Paragraph>
            AlphaNote는 웹사이트와 응용 프로그램을 통해 다음과 같은 서비스를 제공하고 있습니다.
          </Paragraph>

          <SubsectionTitle>습관 추적(Habit Tracking) 서비스</SubsectionTitle>
          <List>
            <ListItem>습관 생성, 기록, 관리 기능</ListItem>
            <ListItem>연간 활동 캘린더를 통한 시각화</ListItem>
            <ListItem>연속 달성 기록(Streak) 추적</ListItem>
            <ListItem>습관 목표 설정 및 달성 현황 확인</ListItem>
          </List>

          <SubsectionTitle>Q&A 커뮤니티 서비스</SubsectionTitle>
          <List>
            <ListItem>질문 작성 및 답변 기능</ListItem>
            <ListItem>태그 시스템을 통한 분류 및 검색</ListItem>
            <ListItem>커뮤니티 상호작용(조회, 추천 등)</ListItem>
          </List>

          <Paragraph>
            여러분은 AlphaNote의 서비스를 자유롭게 이용할 수 있으며, 개별 서비스의 구체적인 내용은 각 서비스의 안내문, 공지사항, 운영 규정 등을 통해 확인할 수 있습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제3조 (회원가입 및 계정 관리)</SectionTitle>

          <SubsectionTitle>회원가입</SubsectionTitle>
          <Paragraph>
            여러분은 이 약관을 읽고 동의하신 후에 회원 가입을 신청하실 수 있습니다. AlphaNote가 여러분의 회원 신청정보 등을 확인하고 승낙하면 회원 가입 절차가 완료됩니다.
          </Paragraph>

          <SubsectionTitle>계정의 부여 및 사용</SubsectionTitle>
          <Paragraph>
            AlphaNote는 회원에게 서비스 이용계정을 부여하고, 회원은 이 계정을 이용하여 AlphaNote가 제공하는 서비스를 편리하게 이용할 수 있습니다.
          </Paragraph>

          <SubsectionTitle>계정 보안</SubsectionTitle>
          <List>
            <ListItem>허위 정보를 기재하여 회원 가입 신청을 해서는 안 됩니다.</ListItem>
            <ListItem>자신의 계정을 다른 사람에게 판매, 양도, 대여 또는 담보로 제공하거나 다른 사람에게 그 사용을 허락해서는 안 됩니다.</ListItem>
            <ListItem>자신의 계정이 아닌 타인의 계정을 무단으로 사용해서는 안 됩니다.</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>제4조 (게시물과 콘텐츠에 대한 권리)</SectionTitle>

          <SubsectionTitle>콘텐츠 권리의 귀속</SubsectionTitle>
          <Paragraph>
            여러분은 습관 기록, 질문, 답변, 사진 등의 콘텐츠를 AlphaNote에 게시할 수 있으며, 이러한 게시물에 대한 저작권을 포함한 지적재산권은 당연히 권리자가 계속하여 보유합니다.
          </Paragraph>

          <SubsectionTitle>콘텐츠 이용 권한</SubsectionTitle>
          <Paragraph>
            AlphaNote를 통해 여러분이 제공한 게시물을 적법하게 공유하려면 해당 콘텐츠에 대한 저장, 복제, 수정, 공중 송신, 전시, 배포 등의 이용 권한이 필요합니다. 게시물 게재로 여러분은 AlphaNote에게 그러한 권한을 부여하게 되며, 이러한 권리를 보유하지 않아 발생하는 모든 문제에 대해서는 게시자가 책임을 부담하게 됩니다.
          </Paragraph>

          <SubsectionTitle>콘텐츠 이용 범위</SubsectionTitle>
          <Paragraph>
            AlphaNote는 여러분이 부여해 주신 콘텐츠 이용 권한을 저작권법 등 관련 법령에서 정하는 바에 따라 다음의 목적을 위해서만 제한적으로 행사합니다:
          </Paragraph>
          <List>
            <ListItem>AlphaNote 서비스 내 노출</ListItem>
            <ListItem>서비스 홍보를 위한 활용</ListItem>
            <ListItem>서비스 운영, 개선 및 새로운 서비스 개발을 위한 연구</ListItem>
            <ListItem>웹 접근성 등 법률상 의무 준수</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>제5조 (서비스 이용 제한)</SectionTitle>
          <Paragraph>
            다음과 같은 행위는 금지되며, 이를 위반할 경우 서비스 이용이 제한될 수 있습니다:
          </Paragraph>

          <SubsectionTitle>금지 행위</SubsectionTitle>
          <List>
            <ListItem>타인에 대해 위협을 가하는 내용의 게시물</ListItem>
            <ListItem>타인의 신상정보, 사생활 등 비공개 개인정보를 드러내는 내용의 게시물</ListItem>
            <ListItem>타인을 지속적으로 따돌리거나 괴롭히는 내용의 게시물</ListItem>
            <ListItem>관련 법령상 금지되거나 형사처벌의 대상이 되는 행위</ListItem>
            <ListItem>타인의 지식재산권 등을 침해하거나 모욕, 사생활 침해 또는 명예훼손 등 타인의 권리를 침해하는 내용</ListItem>
            <ListItem>성적 수치심을 유발시킬 수 있는 내용의 게시물</ListItem>
            <ListItem>잔혹감 또는 혐오감을 일으킬 수 있는 폭력적이고 자극적인 내용의 게시물</ListItem>
            <ListItem>본인 이외의 자를 사칭하거나 허위사실을 주장하는 등 타인을 기만하는 내용의 게시물</ListItem>
            <ListItem>과도한 욕설, 비속어 등을 사용하여 혐오감 또는 불쾌감을 일으키는 내용의 게시물</ListItem>
            <ListItem>AlphaNote 서비스의 기능을 비정상적으로 이용하여 게재된 게시물</ListItem>
            <ListItem>AlphaNote의 동의 없이 자동화된 수단에 의해 게시물을 업로드하거나 콘텐츠에 수정·변조·삭제 등의 영향을 끼치는 행위</ListItem>
          </List>

          <Paragraph>
            여러분의 서비스 이용과 권리침해 예방을 위해 위의 사항에 해당하는 문제가 발생될 경우, 여러분의 게시물 게재나 AlphaNote 서비스 이용이 제한될 수 있습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제6조 (서비스 변경 및 중단)</SectionTitle>
          <Paragraph>
            AlphaNote는 서비스의 제공을 위해 최선을 다하고 있습니다만, 다음과 같은 경우 서비스의 전부 또는 일부를 제한하거나 중단할 수 있습니다:
          </Paragraph>
          <List>
            <ListItem>서비스용 설비의 보수 등 공사로 인한 부득이한 경우</ListItem>
            <ListItem>전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를 중단한 경우</ListItem>
            <ListItem>국가비상사태, 정전, 서비스 설비의 장애 또는 서비스 이용의 폭주 등으로 정상적인 서비스 이용에 지장이 있는 경우</ListItem>
          </List>
          <Paragraph>
            AlphaNote는 서비스의 변경 또는 중단으로 발생하는 문제에 대해서는 관련 법령이 정하는 바에 따라 대응합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제7조 (광고의 게재)</SectionTitle>
          <Paragraph>
            AlphaNote 서비스에는 다양한 종류의 광고가 게재될 수 있습니다. 이는 여러분에게 제공하는 AlphaNote 서비스를 원칙적으로 무료로 제공할 수 있게 해주는 데 기여하며, 더 나아가 AlphaNote가 연구 개발에 투자하여 더 나은 서비스를 제공할 수 있는 기반이 됩니다.
          </Paragraph>
          <Paragraph>
            AlphaNote는 더 나은 서비스의 제공을 위하여 여러분에게 서비스의 이용과 관련된 각종 고지, 관리 메시지 및 기타 광고를 비롯한 다양한 정보를 서비스 내에 표시하거나 여러분의 연락처로 발송할 수 있습니다. 단, 광고성 정보 전송의 경우에는 사전에 수신에 동의한 경우에만 전송합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제8조 (유료 서비스)</SectionTitle>
          <Paragraph>
            AlphaNote 서비스는 무료로 제공되는 것이 기본 원칙입니다만, 개별 서비스 내의 일부 기능은 수익자 비용부담의 원칙 하에 유료로 제공될 수 있습니다.
          </Paragraph>
          <Paragraph>
            여러분이 회사가 제공하는 유료 기능을 이용하는 경우 이용대금을 납부한 후 이용하는 것을 원칙으로 합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제9조 (개인정보 보호)</SectionTitle>
          <Paragraph>
            AlphaNote는 여러분의 개인정보를 소중하게 보호합니다. AlphaNote는 서비스의 제공을 위하여 회원이 동의한 목적과 범위 내에서만 개인정보를 수집·이용하며, 개인정보 보호 관련 법령에 따라 관리합니다.
          </Paragraph>
          <Paragraph>
            관련 법령에 의하거나 여러분이 별도로 동의하지 아니하는 한 회사가 여러분의 개인정보를 제3자에게 제공하는 일은 없습니다.
          </Paragraph>
          <Paragraph>
            AlphaNote가 이용자 및 회원에 대해 관련 개인정보를 안전하게 처리하기 위하여 기울이는 노력이나 기타 상세한 사항은 개인정보 처리방침에서 확인하실 수 있습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제10조 (책임의 제한)</SectionTitle>
          <Paragraph>
            회사의 과실로 인하여 여러분이 손해를 입게 될 경우 본 약관 및 관련 법령에 따라 여러분의 손해를 배상하겠습니다.
          </Paragraph>
          <Paragraph>
            다만 회사는 다음의 경우에 대해서는 책임을 부담하지 않습니다:
          </Paragraph>
          <List>
            <ListItem>천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우</ListItem>
            <ListItem>이용자의 고의 또는 과실로 인하여 발생된 손해</ListItem>
            <ListItem>여러분 상호간 또는 여러분과 제3자 상호간에 서비스를 매개로 발생한 분쟁</ListItem>
          </List>
          <Paragraph>
            한편, 회사는 관련 법률에 직접적으로 저촉되지 않는 한 간접 손해, 특별 손해, 결과적 손해, 징계적 손해, 및 징벌적 손해에 대한 책임을 부담하지 않습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제11조 (이용계약의 해지)</SectionTitle>
          <Paragraph>
            회원은 언제든지 AlphaNote 서비스 이용계약 해지를 신청하여 회원에서 탈퇴할 수 있으며, 이 경우 AlphaNote는 관련 법령 등이 정하는 바에 따라 즉시 처리합니다.
          </Paragraph>
          <Paragraph>
            서비스 이용계약이 해지된 경우라도 여러분은 다시 회사에 대하여 이용계약의 체결을 신청할 수 있습니다. 다만, 여러분이 관련 법령, 본 약관 및 세부지침을 준수하지 않아 서비스의 이용이 중단된 상태에서 이용계약을 해지한 후 다시 이용계약 체결을 신청하는 경우에는 서비스 가입과 이용에 일정기간 기능적 제한이 있을 수 있습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제12조 (통지 및 공지)</SectionTitle>
          <Paragraph>
            AlphaNote가 회원에게 개별적으로 통지를 하는 경우 전자메일, 서비스 내 알림 또는 기타 적절한 전자적 수단을 통해 알려 드릴 것이며, 회원 전체에 대한 공지가 필요할 경우엔 7일 이상 AlphaNote 초기 화면의 공지사항 등에 관련 내용을 게시하도록 하겠습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제13조 (약관의 개정)</SectionTitle>
          <Paragraph>
            AlphaNote는 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있습니다. 본 약관이 변경되는 경우, 회사는 변경사항을 시행일자 7일 전부터 여러분에게 서비스 공지사항에서 공지 또는 통지하는 것을 원칙으로 하며, 여러분에게 불리한 내용으로 변경할 경우에는 그 시행일자 30일 전부터 서비스 내에 공지하고 별도의 전자적 수단(이메일 등)을 통해 개별적으로 알릴 것입니다.
          </Paragraph>
          <Paragraph>
            AlphaNote가 변경된 약관을 게시한 날부터 효력 발생일까지 거부의사가 표시되지 않을 경우에는 여러분이 변경된 약관으로 서비스를 이용하는 데에 동의하는 것으로 간주됩니다. 또한 여러분은 변경된 약관에 대하여 거부의사를 표시함으로써 이용계약의 해지를 선택할 수 있습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제14조 (준거법 및 관할)</SectionTitle>
          <Paragraph>
            이 약관은 한국어를 정본으로 합니다. 약관 또는 AlphaNote 서비스와 관련된 여러분과 AlphaNote와의 관계에는 대한민국의 법령이 적용됩니다.
          </Paragraph>
          <Paragraph>
            약관 또는 AlphaNote 서비스와 관련하여 여러분과 AlphaNote 사이에 분쟁이 발생할 경우, 그 분쟁의 처리는 대한민국 「민사소송법」에서 정한 절차를 따릅니다.
          </Paragraph>
        </Section>
      </PolicyContent>
    </PolicyContainer>
  );
};

export default TermsPage;
