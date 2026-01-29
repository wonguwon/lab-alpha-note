import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { qnaService, habitService, goalService, growthLogService } from '../../api/services';
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
import {
  GrowthLogList,
  GrowthLogCard,
  GrowthLogCardImage,
  GrowthLogCardContent,
  GrowthLogTag,
  GrowthLogTitle,
  GrowthLogExcerpt,
  GrowthLogMeta,
  AuthorInfo,
  GrowthLogInfoRow,
  GrowthLogDate,
  CommentCount,
  LikeCount
} from '../GrowthLogPage/GrowthLogPage.styled';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [recentHabits, setRecentHabits] = useState([]);
  const [popularGrowthLogs, setPopularGrowthLogs] = useState([]);
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

        // 인기 성장기록 8개 가져오기 (최근 1개월 내, 조회수 기준)
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const fromDate = oneMonthAgo.toISOString().split('T')[0];

        const growthLogsData = await growthLogService.getGrowthLogs({
          page: 0,
          size: 8,
          sort: 'viewCount,desc',
          fromDate: fromDate
        });

        setRecentQuestions(questionsData.content || []);
        setRecentHabits(habitsData.habits || []);
        setPopularGrowthLogs(growthLogsData.content || []);

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

  const stripMarkdown = (markdown) => {
    if (!markdown) return '';

    return markdown
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/~~([^~]+)~~/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/^>\s+/gm, '')
      .replace(/^[-*+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      .replace(/^[-*_]{3,}$/gm, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{2,}/g, ' ')
      .trim();
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
          <PreviewGrid>
            {/* 최근 Q&A */}
            <PreviewSection>
              <PreviewHeader>
                <PreviewTitle>최근 질문</PreviewTitle>
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
                <PreviewTitle>최근 습관</PreviewTitle>
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

      {/* 인기 성장기록 섹션 */}
      {!loading && popularGrowthLogs.length > 0 && (
        <ContentSection>
          <PreviewHeader>
            <SectionTitle style={{ marginBottom: 0, textAlign: 'left' }}>인기 성장기록</SectionTitle>
            <ViewAllButton onClick={() => navigate('/growth-logs')}>
              전체보기 →
            </ViewAllButton>
          </PreviewHeader>

          <GrowthLogList style={{ marginTop: '32px' }}>
            {popularGrowthLogs.map(growthLog => (
              <GrowthLogCard key={growthLog.id} onClick={() => navigate(`/growth-logs/${growthLog.id}`)}>
                {growthLog.thumbnailUrl && <GrowthLogCardImage $src={growthLog.thumbnailUrl} />}
                <GrowthLogCardContent>
                  {growthLog.category && <GrowthLogTag>{growthLog.category}</GrowthLogTag>}
                  <GrowthLogTitle>{growthLog.title}</GrowthLogTitle>
                  <GrowthLogExcerpt>
                    {stripMarkdown(growthLog.content || growthLog.summary || growthLog.contentPreview || '').substring(0, 100)}
                    {stripMarkdown(growthLog.content || growthLog.summary || growthLog.contentPreview || '').length > 100 && '...'}
                  </GrowthLogExcerpt>
                  <GrowthLogInfoRow>
                    <TagList>
                      {growthLog.tags && growthLog.tags.slice(0, 3).map((tag, i) => (
                        <Tag key={i}>{typeof tag === 'string' ? tag : tag.name}</Tag>
                      ))}
                    </TagList>
                    <GrowthLogDate>{new Date(growthLog.updatedAt || growthLog.createdAt).toLocaleDateString()}</GrowthLogDate>
                  </GrowthLogInfoRow>
                  <GrowthLogMeta>
                    <AuthorInfo>by {growthLog.userNickname || '익명'}</AuthorInfo>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CommentCount>💬 {growthLog.commentCount || 0}</CommentCount>
                      <LikeCount>♡ {growthLog.voteCount || 0}</LikeCount>
                    </div>
                  </GrowthLogMeta>
                </GrowthLogCardContent>
              </GrowthLogCard>
            ))}
          </GrowthLogList>
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
              연간 활동판을 통해 한눈에 진행 상황을 확인할 수 있습니다.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard style={{ cursor: 'pointer' }} onClick={() => navigate('/qna')}>
            <FeatureIcon>💬</FeatureIcon>
            <FeatureTitle>Q&A 커뮤니티</FeatureTitle>
            <FeatureDescription>
              궁금한 점을 질문하고 경험을 나누세요.
              서로의 질문과 답변을 통해 함께 배우고 성장하는 커뮤니티입니다.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard style={{ cursor: 'pointer' }} onClick={() => navigate('/goals')}>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>목표설정</FeatureTitle>
            <FeatureDescription>
              연간 목표를 설정하고 달성 과정을 추적하세요.
              목표를 향해 나아가는 과정을 기록하며 스스로의 성장을 확인할 수 있습니다.
            </FeatureDescription>
          </FeatureCard>

            <FeatureCard style={{ cursor: 'pointer' }} onClick={() => navigate('/growth-logs')}>
            <FeatureIcon>✍️</FeatureIcon>
            <FeatureTitle>성장로그</FeatureTitle>
            <FeatureDescription>
              성장을 위한 나만의 기록 공간.
              배운 것, 느낀 것, 시도한 것을 블로그 형태로 정리하고 공유할 수 있습니다.
              나의 생각이 쌓여 하나의 성장 히스토리가 됩니다.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard style={{ cursor: 'pointer' }} onClick={() => alert("개발중인 기능입니다.")}>
            <FeatureIcon>🤖</FeatureIcon>
            <FeatureTitle>AI 멘토링 (개발 중)</FeatureTitle>
            <FeatureDescription>
              내가 작성한 GrowthLog를 기반으로
              AI와 질문·답변을 주고받으며 학습을 확장하세요.
              기록이 곧 학습으로 이어지는 새로운 성장 경험을 제공합니다.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard style={{ cursor: 'pointer' }} onClick={() => alert("개발중인 기능입니다.")}>
            <FeatureIcon>🧩</FeatureIcon>
            <FeatureTitle>성장 대시보드 (개발 중)</FeatureTitle>
            <FeatureDescription>
              습관 기록, 성장 로그, 목표 달성 이력을 하나로 모아
              나만의 성장 페이지를 만들어 드립니다.
              앞으로는 이 페이지가 이력서이자 포트폴리오가 될 수 있습니다.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </ContentSection>
    </HomeContainer>
  );
};

export default HomePage;