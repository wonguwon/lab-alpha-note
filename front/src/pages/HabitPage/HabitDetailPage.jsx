import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { habitService } from '../../api/services';
import useAuthStore from '../../store/authStore';
import Modal from '../../components/common/Modal/Modal';
import * as S from './HabitDetailPage.styled';

const HabitDetailPage = () => {
  const { habitId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [habitData, setHabitData] = useState(null);
  const [records, setRecords] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarData, setCalendarData] = useState({}); // 1년치 캘린더 데이터

  // 기록 추가 폼 상태
  const [addNote, setAddNote] = useState('');

  // 기록 수정 모달 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // 수정 중인 개별 기록
  const [editNoteText, setEditNoteText] = useState('');

  const [todayRecordCount, setTodayRecordCount] = useState(0);

  // 월별 필터 상태 (YYYY-MM 형식)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    if (habitId) {
      loadHabitDetail();
    }
  }, [habitId]);

  const loadHabitDetail = async () => {
    try {
      setLoading(true);

      const now = new Date();
      const currentYear = now.getFullYear();
      const startMonth = `${currentYear}-01`; // 올해 1월
      const endMonth = `${currentYear}-12`; // 올해 12월

      // 습관 상세 정보, 기록 목록, 캘린더 데이터를 병렬로 가져오기
      const [habitResponse, recordsResponse, calendarResponse] = await Promise.all([
        habitService.getHabit(habitId),
        habitService.getHabitRecords(habitId, {
          page: 0,
          size: 1000,
          sort: 'recordDate,DESC' // 최신순 정렬
        }),
        habitService.getHabitCalendar(habitId, {
          startMonth,
          endMonth
        })
      ]);

      setHabitData(habitResponse);
      const recordsList = recordsResponse.content || [];

      // 날짜별로 기록 그룹핑 (같은 날짜의 기록들을 하나로 합침)
      const groupedRecords = groupRecordsByDate(recordsList);
      setRecords(groupedRecords);

      // 캘린더 데이터 저장 (recordCountByDate 맵을 날짜 문자열 키로 변환)
      const calendarMap = {};
      if (calendarResponse && calendarResponse.recordCountByDate) {
        Object.entries(calendarResponse.recordCountByDate).forEach(([date, count]) => {
          calendarMap[date] = count;
        });
      }
      setCalendarData(calendarMap);

      // 오늘 날짜의 기록 개수 확인
      const today = new Date().toISOString().split('T')[0];
      const todayGroup = groupedRecords.find(g => g.recordDate === today);
      setTodayRecordCount(todayGroup ? todayGroup.totalCount : 0);
    } catch (error) {
      console.error('Failed to load habit detail:', error);
    } finally {
      setLoading(false);
    }
  };

  // 날짜별로 기록 그룹핑하는 함수
  const groupRecordsByDate = (recordsList) => {
    const grouped = {};

    recordsList.forEach(record => {
      const date = record.recordDate;
      if (!grouped[date]) {
        grouped[date] = {
          recordDate: date,
          records: [], // 개별 기록들
          totalCount: 0,
          notes: [] // 모든 메모들
        };
      }
      grouped[date].records.push(record);
      grouped[date].totalCount += record.count;
      if (record.note) {
        grouped[date].notes.push(record.note);
      }
    });

    // 배열로 변환하고 날짜 내림차순 정렬
    return Object.values(grouped).sort((a, b) =>
      new Date(b.recordDate) - new Date(a.recordDate)
    );
  };

  // 기록 추가 (count는 항상 1, 메모 포함)
  const handleAddRecord = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const today = new Date().toISOString().split('T')[0];
      const recordData = {
        recordDate: today,
        count: 1,
        note: addNote.trim() || null
      };

      await habitService.createHabitRecord(habitId, recordData);
      alert('습관 기록이 추가되었습니다!');

      // 폼 초기화 및 데이터 새로고침
      setAddNote('');
      await loadHabitDetail();
    } catch (error) {
      console.error('Failed to add record:', error);
      alert(error.response?.data?.message || '기록 추가에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 개별 기록 수정 모달 열기
  const handleRecordClick = (record) => {
    if (!isMyHabit) return;
    setEditingRecord(record);
    setEditNoteText(record.note || '');
    setIsEditModalOpen(true);
  };

  // 모달 닫기
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingRecord(null);
    setEditNoteText('');
  };

  // 기록 수정 제출
  const handleUpdateRecord = async () => {
    if (isSubmitting || !editingRecord) return;

    try {
      setIsSubmitting(true);

      const recordData = {
        recordDate: editingRecord.recordDate,
        count: editingRecord.count,
        note: editNoteText.trim() || null
      };

      await habitService.updateHabitRecord(habitId, editingRecord.id, recordData);
      alert('기록이 수정되었습니다!');

      // 모달 닫기 및 데이터 새로고침
      handleCloseEditModal();
      await loadHabitDetail();
    } catch (error) {
      console.error('Failed to update record:', error);
      alert(error.response?.data?.message || '기록 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 내 습관인지 확인
  const isMyHabit = habitData && user && habitData.userId === user.id;

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

  // 선택한 월의 기록만 필터링
  const filteredRecords = records.filter(record => {
    const recordMonth = record.recordDate.substring(0, 7); // YYYY-MM 형식으로 추출
    return recordMonth === selectedMonth;
  });

  // 이전 달로 이동
  const handlePreviousMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const newDate = new Date(year, month - 2, 1); // month - 1 (0-based) - 1 (이전 달)
    setSelectedMonth(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    // 이번 달 이후로는 이동 불가
    if (selectedMonth >= currentMonth) return;

    const newDate = new Date(year, month, 1); // month - 1 (0-based) + 1 (다음 달)
    setSelectedMonth(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
  };

  // 선택한 월을 포맷팅 (예: "2025년 1월")
  const formatSelectedMonth = (monthString) => {
    const [year, month] = monthString.split('-').map(Number);
    return `${year}년 ${month}월`;
  };

  // 현재 월인지 확인
  const isCurrentMonth = () => {
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    return selectedMonth === currentMonth;
  };

  // 강도 계산 (0~4 레벨)
  const getIntensity = (count, targetCount) => {
    if (count === 0) return 0;
    const percentage = (count / targetCount) * 100;
    if (percentage >= 100) return 4;
    if (percentage >= 75) return 3;
    if (percentage >= 50) return 2;
    return 1;
  };

  // 1년 캘린더 렌더링 (GitHub 스타일)
  const renderYearCalendar = () => {
    if (!habitData) return null;

    const today = new Date();
    const now = new Date();
    const startDate = new Date(habitData.startDate);
    const currentYear = now.getFullYear();

    // 올해 1월 1일부터 시작
    const yearStart = new Date(currentYear, 0, 1);

    // 해당 월의 첫 주 시작일 (일요일)
    const firstDay = new Date(yearStart);
    firstDay.setDate(firstDay.getDate() - firstDay.getDay());

    // 올해 12월 마지막 날
    const yearEnd = new Date(currentYear, 11, 31);

    // 마지막 주의 종료일 (토요일)
    const lastDay = new Date(yearEnd);
    lastDay.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

    const days = [];
    const monthLabels = [];
    let currentDate = new Date(firstDay);
    let lastMonthProcessed = -1;

    // 시작일부터 종료일까지 모든 날짜 생성
    while (currentDate <= lastDay) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

      // 올해 범위 내인지 확인
      const isInRange = currentDate >= yearStart && currentDate <= yearEnd;
      const count = calendarData[dateStr] || 0;
      const intensity = isInRange ? getIntensity(count, habitData.targetCount) : null;
      const isToday = currentDate.toDateString() === today.toDateString();

      // 시작일 이전인지 확인 (또는 미래인지 확인)
      const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isBeforeStart = currentDateOnly < startDateOnly;
      const isFuture = currentDateOnly > todayOnly;

      // 월 레이블 추출 (각 월의 첫 주 일요일에만)
      if (currentDate.getDay() === 0 && currentDate.getMonth() !== lastMonthProcessed && isInRange) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const columnIndex = Math.floor(days.length / 7);
        monthLabels.push({
          month: currentDate.getMonth(),
          year: currentDate.getFullYear(),
          label: monthNames[currentDate.getMonth()],
          columnIndex
        });
        lastMonthProcessed = currentDate.getMonth();
      }

      days.push({
        date: dateStr,
        intensity,
        isToday,
        count,
        isEmpty: !isInRange,
        isBeforeStart: isBeforeStart || isFuture, // 시작일 이전 또는 미래
        month: currentDate.getMonth(),
        year: currentDate.getFullYear()
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 각 월 레이블의 컬럼 span 계산
    const totalColumns = Math.ceil(days.length / 7);
    monthLabels.forEach((label, idx) => {
      const nextColumnIndex = idx < monthLabels.length - 1
        ? monthLabels[idx + 1].columnIndex
        : totalColumns;
      const columnCount = nextColumnIndex - label.columnIndex;
      label.columnSpan = columnCount; // 그리드 컬럼 수
    });

    return { days, monthLabels };
  };

  // 날짜 셀 클릭 핸들러
  const handleDateCellClick = (day) => {
    if (day.isEmpty || day.isBeforeStart) return;

    // 클릭한 날짜의 년월로 필터 변경
    const yearMonth = day.date.substring(0, 7); // YYYY-MM
    setSelectedMonth(yearMonth);
  };

  const calendarView = renderYearCalendar();

  if (loading) {
    return (
      <S.Container>
        <S.LoadingState>로딩 중...</S.LoadingState>
      </S.Container>
    );
  }

  if (!habitData) {
    return (
      <S.Container>
        <S.EmptyState>습관 정보를 불러올 수 없습니다.</S.EmptyState>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.BackButton onClick={() => navigate('/habits')}>
        ← 목록으로
      </S.BackButton>

      <S.Content>
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

        {/* 1년 캘린더 (GitHub 스타일) */}
        {calendarView && (
          <S.CalendarSection>
            <S.CalendarTitle>연간 활동</S.CalendarTitle>
            <S.CalendarContainer>
              <S.MonthLabelsRow>
                {calendarView.monthLabels.map((label, idx) => (
                  <S.MonthLabel key={idx} $columnSpan={label.columnSpan}>
                    {label.label}
                  </S.MonthLabel>
                ))}
              </S.MonthLabelsRow>
              <S.CalendarGrid>
                {calendarView.days.map((day, idx) => (
                  <S.DayCell
                    key={idx}
                    $intensity={day.intensity}
                    $isEmpty={day.isEmpty}
                    $isToday={day.isToday}
                    $isBeforeStart={day.isBeforeStart}
                    $clickable={!day.isEmpty && !day.isBeforeStart}
                    onClick={() => handleDateCellClick(day)}
                    title={day.isEmpty || day.isBeforeStart ? '' : `${day.date}: ${day.count}회`}
                  />
                ))}
              </S.CalendarGrid>
            </S.CalendarContainer>
            <S.CalendarLegend>
              <S.LegendLabel>Less</S.LegendLabel>
              <S.LegendItem $intensity={0} />
              <S.LegendItem $intensity={1} />
              <S.LegendItem $intensity={2} />
              <S.LegendItem $intensity={3} />
              <S.LegendItem $intensity={4} />
              <S.LegendLabel>More</S.LegendLabel>
            </S.CalendarLegend>
          </S.CalendarSection>
        )}

        {/* 기록 추가 폼 (내 습관인 경우) */}
        {isMyHabit && (
          <S.AddRecordSection>
            <S.AddRecordTitle>
              습관 기록하기 {todayRecordCount > 0 && `(오늘 ${todayRecordCount}회 실천)`}
            </S.AddRecordTitle>
            <S.AddRecordForm onSubmit={handleAddRecord}>
              <S.FormGroup>
                <S.FormLabel>메모 (선택)</S.FormLabel>
                <S.NoteTextarea
                  placeholder="오늘의 느낌이나 특별한 점을 기록해보세요..."
                  value={addNote}
                  onChange={(e) => setAddNote(e.target.value)}
                  maxLength={500}
                />
              </S.FormGroup>
              <S.FormActions>
                <S.SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? '기록 중...' : '✓ 습관 실천 기록하기'}
                </S.SubmitButton>
              </S.FormActions>
            </S.AddRecordForm>
          </S.AddRecordSection>
        )}

        {/* 기록 타임라인 */}
        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>습관 기록</S.SectionTitle>
            <S.MonthSelector>
              <S.MonthButton onClick={handlePreviousMonth}>
                ◀
              </S.MonthButton>
              <S.MonthDisplay>{formatSelectedMonth(selectedMonth)}</S.MonthDisplay>
              <S.MonthButton onClick={handleNextMonth} disabled={isCurrentMonth()}>
                ▶
              </S.MonthButton>
            </S.MonthSelector>
          </S.SectionHeader>
          <S.TimelineContainer>
            {filteredRecords.length === 0 ? (
              <S.EmptyState>선택한 월에 기록이 없습니다.</S.EmptyState>
            ) : (
              <S.Timeline $color={habitData.color}>
              {filteredRecords.map((dayGroup) => {
                const percentage = (dayGroup.totalCount / habitData.targetCount) * 100;
                const achievementType = getAchievementType(dayGroup.totalCount, habitData.targetCount);
                const isToday = dayGroup.recordDate === new Date().toISOString().split('T')[0];

                return (
                  <S.RecordItem key={dayGroup.recordDate} $color={habitData.color}>
                    <S.RecordCard>
                      <S.RecordHeader>
                        <S.RecordDate>
                          {formatDate(dayGroup.recordDate)}
                          <S.RecordTimeAgo>
                            {getTimeAgo(dayGroup.recordDate)}
                            {isToday && ' • 오늘'}
                          </S.RecordTimeAgo>
                        </S.RecordDate>
                      </S.RecordHeader>

                      <S.ProgressContainer>
                        <S.ProgressBar>
                          <S.ProgressFill $percentage={percentage} />
                        </S.ProgressBar>
                        <S.RecordCountInfo>
                          <S.CountText>
                            {dayGroup.totalCount}회 / {habitData.targetCount}회
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

                      {/* 개별 기록 목록 */}
                      {dayGroup.records.length > 0 && (
                        <S.RecordList>
                          {dayGroup.records.map((record, index) => (
                            <S.RecordListItem
                              key={record.id}
                              onClick={() => handleRecordClick(record)}
                              $clickable={isMyHabit}
                            >
                              <S.RecordNumber>{index + 1}회차</S.RecordNumber>
                              <S.RecordNoteText>
                                {record.note || '...'}
                              </S.RecordNoteText>
                              {isMyHabit && (
                                <S.EditIcon>✏️</S.EditIcon>
                              )}
                            </S.RecordListItem>
                          ))}
                        </S.RecordList>
                      )}
                    </S.RecordCard>
                  </S.RecordItem>
                );
              })}
              </S.Timeline>
            )}
          </S.TimelineContainer>
        </S.Section>
      </S.Content>

      {/* 기록 수정 모달 */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="습관 기록 수정"
        maxWidth="600px"
        actions={[
          {
            label: '취소',
            onClick: handleCloseEditModal,
            variant: 'default'
          },
          {
            label: isSubmitting ? '저장 중...' : '저장',
            onClick: handleUpdateRecord,
            variant: 'primary',
            disabled: isSubmitting
          }
        ]}
      >
        <S.ModalContent>
          {editingRecord && (
            <>
              <S.ModalInfo>
                <S.ModalInfoLabel>날짜</S.ModalInfoLabel>
                <S.ModalInfoValue>{formatDate(editingRecord.recordDate)}</S.ModalInfoValue>
              </S.ModalInfo>
              <S.FormGroup>
                <S.FormLabel>메모</S.FormLabel>
                <S.NoteTextarea
                  placeholder="메모를 입력하세요..."
                  value={editNoteText}
                  onChange={(e) => setEditNoteText(e.target.value)}
                  maxLength={500}
                  autoFocus
                />
                <S.CharCount>
                  {editNoteText.length} / 500
                </S.CharCount>
              </S.FormGroup>
            </>
          )}
        </S.ModalContent>
      </Modal>
    </S.Container>
  );
};

export default HabitDetailPage;
