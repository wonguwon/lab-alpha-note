import React, { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal/Modal';
import { habitService } from '../../api/services';
import * as S from './HabitDetailModal.styled';

const HabitDetailModal = ({ isOpen, onClose, habitId }) => {
  const [loading, setLoading] = useState(false);
  const [habitData, setHabitData] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (isOpen && habitId) {
      loadHabitDetail();
    }
  }, [isOpen, habitId]);

  const loadHabitDetail = async () => {
    try {
      setLoading(true);

      // 습관 상세 정보와 기록 목록을 병렬로 가져오기
      const [habitResponse, recordsResponse] = await Promise.all([
        habitService.getHabit(habitId),
        habitService.getHabitRecords(habitId, {
          page: 0,
          size: 100,
          sort: 'recordDate,DESC' // 최신순 정렬
        })
      ]);

      setHabitData(habitResponse);
      setRecords(recordsResponse.content || []);
    } catch (error) {
      console.error('Failed to load habit detail:', error);
    } finally {
      setLoading(false);
    }
  };

  // 상대 시간 계산 (예: "오늘", "어제", "3일 전")
  const getTimeAgo = (dateString) => {
    const recordDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    recordDate.setHours(0, 0, 0, 0);

    const diffTime = today - recordDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
    return `${Math.floor(diffDays / 365)}년 전`;
  };

  // 날짜 포맷 (YYYY-MM-DD -> YYYY년 M월 D일 (요일))
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];

    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  };

  // 달성도 계산
  const getAchievementType = (count, targetCount) => {
    const percentage = (count / targetCount) * 100;
    if (percentage > 100) return 'exceed'; // 목표 초과
    if (percentage >= 100) return 'achieve'; // 목표 달성
    return 'partial'; // 부분 달성
  };

  const renderContent = () => {
    if (loading) {
      return <S.LoadingState>로딩 중...</S.LoadingState>;
    }

    if (!habitData) {
      return <S.EmptyState>습관 정보를 불러올 수 없습니다.</S.EmptyState>;
    }

    return (
      <S.ModalContent>
        {/* 습관 헤더 */}
        <S.HabitHeader>
          <S.HabitColorBar $color={habitData.color} />
          <S.HabitInfo>
            <S.HabitTitle>{habitData.title}</S.HabitTitle>
            <S.HabitMeta>
              <span>시작일: {new Date(habitData.startDate).toLocaleDateString('ko-KR')}</span>
              {habitData.endDate && (
                <span>종료일: {new Date(habitData.endDate).toLocaleDateString('ko-KR')}</span>
              )}
            </S.HabitMeta>
            <S.TargetInfo>
              목표: {habitData.targetCount}회/일
            </S.TargetInfo>
          </S.HabitInfo>
        </S.HabitHeader>

        {/* 통계 정보 */}
        <S.StatsContainer>
          <S.StatItem>
            <S.StatValue>{habitData.currentStreak}</S.StatValue>
            <S.StatLabel>현재 연속</S.StatLabel>
          </S.StatItem>
          <S.StatItem>
            <S.StatValue>{habitData.longestStreak}</S.StatValue>
            <S.StatLabel>최장 연속</S.StatLabel>
          </S.StatItem>
          <S.StatItem>
            <S.StatValue>{habitData.totalRecords}</S.StatValue>
            <S.StatLabel>총 기록</S.StatLabel>
          </S.StatItem>
        </S.StatsContainer>

        {/* 기록 타임라인 */}
        <S.TimelineContainer>
          {records.length === 0 ? (
            <S.EmptyState>아직 기록이 없습니다.</S.EmptyState>
          ) : (
            <S.Timeline $color={habitData.color}>
              {records.map((record) => {
                const percentage = (record.count / habitData.targetCount) * 100;
                const achievementType = getAchievementType(record.count, habitData.targetCount);

                return (
                  <S.RecordItem key={record.id} $color={habitData.color}>
                    <S.RecordCard>
                      <S.RecordHeader>
                        <S.RecordDate>
                          {formatDate(record.recordDate)}
                          <S.RecordTimeAgo>{getTimeAgo(record.recordDate)}</S.RecordTimeAgo>
                        </S.RecordDate>
                      </S.RecordHeader>

                      <S.ProgressContainer>
                        <S.ProgressBar>
                          <S.ProgressFill $percentage={percentage} />
                        </S.ProgressBar>
                        <S.RecordCountInfo>
                          <S.CountText>
                            {record.count}회 / {habitData.targetCount}회
                          </S.CountText>
                          {achievementType === 'exceed' && (
                            <S.AchievementBadge $type="exceed">
                              🔥 목표 초과
                            </S.AchievementBadge>
                          )}
                          {achievementType === 'achieve' && (
                            <S.AchievementBadge $type="achieve">
                              ✓ 목표 달성
                            </S.AchievementBadge>
                          )}
                        </S.RecordCountInfo>
                      </S.ProgressContainer>

                      {record.note && (
                        <S.RecordNote>{record.note}</S.RecordNote>
                      )}
                    </S.RecordCard>
                  </S.RecordItem>
                );
              })}
            </S.Timeline>
          )}
        </S.TimelineContainer>
      </S.ModalContent>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="습관 기록 상세"
      maxWidth="800px"
      actions={[
        {
          label: '닫기',
          onClick: onClose,
          variant: 'default'
        }
      ]}
    >
      {renderContent()}
    </Modal>
  );
};

export default HabitDetailModal;
