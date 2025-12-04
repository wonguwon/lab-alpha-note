import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { qnaService, habitService } from '../../api/services';
import {
  HomeContainer,
  HeroSection,
  HeroTitle,
  HeroDescription,
  CTAButtons,
  Button,
  ContentSection,
  SectionTitle,
  PreviewGrid,
  PreviewSection,
  PreviewHeader,
  PreviewTitle,
  ViewAllButton,
  QuestionList,
  HabitList,
  QuestionPreviewCard,
  HabitPreviewCard,
  CardTitle,
  CardMeta,
  MetaItem,
  TagList,
  Tag,
  HabitCardHeader,
  HabitColorBar,
  StreakBadge,
  FeatureGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription
} from './HomePage.styled';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [recentHabits, setRecentHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 최근 Q&A 5개 가져오기
        const questionsData = await qnaService.getQuestions({
          page: 0,
          size: 5,
          sort: 'createdAt,desc'
        });

        // 최근 습관 5개 가져오기 (6개월 캘린더 포함)
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const startMonth = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const startMonthStr = `${startMonth.getFullYear()}-${String(startMonth.getMonth() + 1).padStart(2, '0')}`;

        const habitsData = await habitService.getHabitDashboard({
          status: 'ACTIVE',
          size: 5,
          startMonth: startMonthStr,
          endMonth: currentMonth,
          sortType: 'LATEST',
          expired: false
        });

        setRecentQuestions(questionsData.content || []);
        setRecentHabits(habitsData.habits || []);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/habits');
    } else {
      navigate('/signup');
    }
  };

  const handleLearnMore = () => {
    navigate('/qna');
  };

  return (
    <HomeContainer>
      {/* 히어로 섹션 */}
      <HeroSection>
        <HeroTitle>
          성장을 기록하고 <br />
          지식을 공유하세요
        </HeroTitle>
        <HeroDescription>
          AlphaNote와 함께 습관을 추적하고, 궁금한 점을 질문하세요. <br />
          매일매일 성장하는 우리를 기록합니다.
        </HeroDescription>
        <CTAButtons>
          <Button className="primary" onClick={handleGetStarted}>습관 기록하기</Button>
          <Button className="secondary" onClick={handleLearnMore}>Q&A 둘러보기</Button>
        </CTAButtons>
      </HeroSection>

      {/* 최근 Q&A 및 습관 섹션 */}
      {!loading && (recentQuestions.length > 0 || recentHabits.length > 0) && (
        <ContentSection>
          <SectionTitle>최근 활동</SectionTitle>

          <PreviewGrid>
            {/* 최근 Q&A */}
            <PreviewSection>
              <PreviewHeader>
                <PreviewTitle>💬 최근 질문</PreviewTitle>
                <ViewAllButton onClick={() => navigate('/qna')}>
                  전체보기 →
                </ViewAllButton>
              </PreviewHeader>
              <QuestionList>
                {recentQuestions.length > 0 ? (
                  recentQuestions.map(question => (
                    <QuestionPreviewCard key={question.id} onClick={() => navigate(`/qna/${question.id}`)}>
                      <CardTitle>{question.title}</CardTitle>
                      <CardMeta>
                        <MetaItem>{question.userNickname || '익명'}</MetaItem>
                        <MetaItem>답변 {question.answerCount || 0}</MetaItem>
                        <MetaItem>{formatTimeAgo(question.createdAt)}</MetaItem>
                      </CardMeta>
                      {question.tags && question.tags.length > 0 && (
                        <TagList>
                          {question.tags.slice(0, 3).map(tag => (
                            <Tag key={tag.id}>{tag.name}</Tag>
                          ))}
                        </TagList>
                      )}
                    </QuestionPreviewCard>
                  ))
                ) : (
                  <CardMeta>아직 등록된 질문이 없습니다.</CardMeta>
                )}
              </QuestionList>
            </PreviewSection>

            {/* 최근 습관 */}
            <PreviewSection>
              <PreviewHeader>
                <PreviewTitle>🎯 최근 습관</PreviewTitle>
                <ViewAllButton onClick={() => navigate('/habits')}>
                  전체보기 →
                </ViewAllButton>
              </PreviewHeader>
              <HabitList>
                {recentHabits.length > 0 ? (
                  recentHabits.map(habit => (
                    <HabitPreviewCard key={habit.id} onClick={() => navigate(`/habits/${habit.id}`)}>
                      <HabitCardHeader>
                        <HabitColorBar $color={habit.color} />
                        <CardTitle>{habit.title}</CardTitle>
                        {habit.currentStreak >= 2 && (
                          <StreakBadge>
                            🔥 {habit.currentStreak}
                          </StreakBadge>
                        )}
                      </HabitCardHeader>
                      <CardMeta>
                        <MetaItem>by {habit.userNickname || '익명'}</MetaItem>
                        <MetaItem>총 {habit.totalRecords || 0}회</MetaItem>
                      </CardMeta>
                    </HabitPreviewCard>
                  ))
                ) : (
                  <CardMeta>아직 등록된 습관이 없습니다.</CardMeta>
                )}
              </HabitList>
            </PreviewSection>
          </PreviewGrid>
        </ContentSection>
      )}

      {/* 주요 기능 섹션 */}
      <ContentSection>
        <SectionTitle>AlphaNote가 제공하는 기능</SectionTitle>

        <FeatureGrid>
          <FeatureCard style={{ cursor: 'pointer' }}>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>습관 트래킹</FeatureTitle>
            <FeatureDescription>
              매일의 습관을 기록하고 시각화하세요.
              연간 활동 캘린더로 한눈에 진행 상황을 확인할 수 있습니다.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard style={{ cursor: 'pointer' }}>
            <FeatureIcon>💬</FeatureIcon>
            <FeatureTitle>Q&A 커뮤니티</FeatureTitle>
            <FeatureDescription>
              궁금한 점을 질문하고 다른 사용자들과 지식을 공유하세요.
              답변을 통해 함께 성장할 수 있습니다.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard style={{ cursor: 'pointer' }}>
            <FeatureIcon>🏷️</FeatureIcon>
            <FeatureTitle>태그 시스템</FeatureTitle>
            <FeatureDescription>
              질문과 답변에 태그를 추가하여 쉽게 분류하고 검색할 수 있습니다.
              관심있는 주제를 빠르게 찾아보세요.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </ContentSection>
    </HomeContainer>
  );
};

export default HomePage;