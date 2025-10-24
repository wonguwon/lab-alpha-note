import React, { useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { authService } from '../../api/services';
import {
  HomeContainer,
  HeroSection,
  HeroTitle,
  HeroDescription,
  CTAButtons,
  Button,
  ContentSection,
  SectionTitle,
  FeatureGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription
} from './HomePage.styled';

const HomePage = () => {
  const { isAuthenticated, user, setUser, setError, setLoading } = useAuthStore();

  useEffect(() => {
    // 로그인 상태이지만 사용자 정보가 없는 경우 API 호출
    if (isAuthenticated && !user) {
      const fetchUserInfo = async () => {
        setLoading(true);
        try {
          const userInfo = await authService.getUserInfo();
          setUser(userInfo);
        } catch (error) {
          console.error('Failed to fetch user info:', error);
          setError('사용자 정보를 불러오는데 실패했습니다.');
        } finally {
          setLoading(false);
        }
      };

      fetchUserInfo();
    }
  }, [isAuthenticated, user, setUser, setError, setLoading]);
  return (
    <HomeContainer>
      {/* 히어로 섹션 */}
      <HeroSection>
        <HeroTitle>
          당신의 아이디어를 <br />
          체계적으로 관리하세요
        </HeroTitle>
        <HeroDescription>
          Alpha Note와 함께 생각을 정리하고, 창의적인 작업을 더욱 효율적으로 만들어보세요. 
          간편하면서도 강력한 노트 기능을 경험해보세요.
        </HeroDescription>
        <CTAButtons>
          <Button className="primary">무료로 시작하기</Button>
          <Button className="secondary">더 알아보기</Button>
        </CTAButtons>
      </HeroSection>

      {/* 주요 기능 섹션 */}
      <ContentSection>
        <SectionTitle>왜 Alpha Note를 선택해야 할까요?</SectionTitle>
        
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>📝</FeatureIcon>
            <FeatureTitle>직관적인 에디터</FeatureTitle>
            <FeatureDescription>
              마크다운을 지원하는 깔끔하고 사용하기 쉬운 에디터로 
              아이디어를 빠르게 기록할 수 있습니다.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🗂️</FeatureIcon>
            <FeatureTitle>스마트한 정리</FeatureTitle>
            <FeatureDescription>
              태그와 폴더를 활용한 체계적인 분류 시스템으로 
              필요한 노트를 빠르게 찾을 수 있습니다.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>안전한 보관</FeatureTitle>
            <FeatureDescription>
              클라우드 동기화와 강력한 보안으로 언제 어디서나 
              안전하게 노트에 접근할 수 있습니다.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>집중 모드</FeatureTitle>
            <FeatureDescription>
              방해 요소 없는 집중 환경에서 창의적인 작업에만 
              몰입할 수 있는 특별한 모드를 제공합니다.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>모든 기기에서</FeatureTitle>
            <FeatureDescription>
              데스크톱, 태블릿, 모바일 어떤 기기에서든 
              일관된 경험으로 노트를 작성하고 관리할 수 있습니다.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>빠른 검색</FeatureTitle>
            <FeatureDescription>
              강력한 검색 엔진으로 수천 개의 노트 중에서도 
              원하는 내용을 즉시 찾을 수 있습니다.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </ContentSection>
    </HomeContainer>
  );
};

export default HomePage;