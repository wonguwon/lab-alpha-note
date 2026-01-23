import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { qnaService, habitService, goalService } from '../../api/services';
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
  FeatureDescription,
  GoalSection,
  GoalListHome,
  GoalItemHome,
  GoalTextHome
} from './HomePage.styled';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [recentHabits, setRecentHabits] = useState([]);
  const [myYearlyGoal, setMyYearlyGoal] = useState(null);
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

        // 로그인한 경우 올해 목표 가져오기
        if (isAuthenticated) {
          try {
            const currentYear = new Date().getFullYear();
            const goalData = await goalService.getMyYearlyGoal(currentYear);
            setMyYearlyGoal(goalData);
          } catch (error) {
            // 목표가 없으면 404 에러가 발생할 수 있으므로 무시
            if (error.response?.status !== 404) {
              console.error('목표 로딩 실패:', error);
            }
          }
        }
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

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

  const handleGoalSetting = () => {
    if (isAuthenticated) {
      navigate('/goals');
    } else {
      navigate('/login');
    }
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
          <Button className="secondary" onClick={handleGoalSetting}>목표 설정하기</Button>
        </CTAButtons>
      </HeroSection>

      {/* 올해 목표 섹션 */}
      {isAuthenticated && !loading && myYearlyGoal && myYearlyGoal.goals && myYearlyGoal.goals.length > 0 && (
        <ContentSection>
          <SectionTitle>🎯 {new Date().getFullYear()}년 목표</SectionTitle>
          <GoalSection>
            <GoalListHome>
              {myYearlyGoal.goals.map((goal, index) => (
                <GoalItemHome 
                  key={index} 
                  $completed={goal.completed || false}
                  onClick={() => navigate('/goals')}
                >
                  <GoalTextHome $completed={goal.completed || false}>
                    {goal.text}
                  </GoalTextHome>
                </GoalItemHome>
              ))}
            </GoalListHome>
          </GoalSection>
        </ContentSection>
      )}

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
                <PreviewTitle>📅 최근 습관</PreviewTitle>
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
          <FeatureCard style={{ cursor: 'pointer' }} onClick={() => navigate('/habits')}>
            <FeatureIcon>📅</FeatureIcon>
            <FeatureTitle>습관 트래킹</FeatureTitle>
            <FeatureDescription>
              매일의 습관을 기록하고 시각화하세요.
              연간 활동 캘린더로 한눈에 진행 상황을 확인할 수 있습니다.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard style={{ cursor: 'pointer' }} onClick={() => navigate('/qna')}>
            <FeatureIcon>💬</FeatureIcon>
            <FeatureTitle>Q&A 커뮤니티</FeatureTitle>
            <FeatureDescription>
              궁금한 점을 질문하고 다른 사용자들과 지식을 공유하세요.
              답변을 통해 함께 성장할 수 있습니다.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard style={{ cursor: 'pointer' }} onClick={() => navigate('/goals')}>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>목표 관리</FeatureTitle>
            <FeatureDescription>
              연간 목표를 설정하고 달성 여부를 추적하세요.
              목표를 달성하면서 성장의 과정을 기록할 수 있습니다.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </ContentSection>
    </HomeContainer>
  );
};

export default HomePage;