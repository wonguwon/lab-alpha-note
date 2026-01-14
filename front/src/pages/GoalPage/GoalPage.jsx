import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { goalService } from '../../api/services';
import { Alert, Confirm } from '../../components/common/Modal';
import Modal from '../../components/common/Modal/Modal';
import { useAlert, useConfirm, useModal } from '../../hooks/useModal';
import { ButtonSpinner } from '../../components/common/Loading';
import { IoAdd, IoEllipsisVertical, IoCheckmarkCircle, IoCreate, IoTrash, IoCloseCircle } from 'react-icons/io5';
import {
  GoalContainer,
  GoalCard,
  GoalHeader,
  GoalTitle,
  GoalDescription,
  GoalsGrid,
  GoalItemCard,
  GoalItemText,
  GoalItemFooter,
  GoalItemStatus,
  ActionMenuButton,
  ActionMenu,
  ActionMenuItem,
  AddGoalButton,
  ErrorMessage,
  EmptyState,
  EmptyStateText,
  ModalInput,
} from './GoalPage.styled';

const GoalPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const currentYear = new Date().getFullYear();
  const [goals, setGoals] = useState([]);
  const [goalId, setGoalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const menuRefs = useRef({});

  const { isOpen: isAlertOpen, showAlert, alertProps } = useAlert();
  const { isOpen: isConfirmOpen, showConfirm, confirmProps } = useConfirm();
  const { isOpen: isAddModalOpen, openModal: openAddModal, closeModal: closeAddModal } = useModal();
  const { isOpen: isEditModalOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();

  const [newGoalText, setNewGoalText] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      showAlert('로그인이 필요합니다.', { onClose: () => navigate('/login') });
      return;
    }
    loadGoals();
  }, [isAuthenticated]);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenuIndex !== null) {
        const menuElement = menuRefs.current[activeMenuIndex];
        if (menuElement && !menuElement.contains(event.target)) {
          setActiveMenuIndex(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuIndex]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await goalService.getMyYearlyGoal(currentYear);
      if (response) {
        setGoals(response.goals || []);
        setGoalId(response.id);
      } else {
        setGoals([]);
        setGoalId(null);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setGoals([]);
        setGoalId(null);
      } else {
        setErrorMessage('목표를 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoalClick = () => {
    setNewGoalText('');
    openAddModal();
  };

  const handleAddGoal = async () => {
    if (!newGoalText.trim()) {
      showAlert('목표를 입력해주세요.');
      return;
    }

    try {
      const newGoals = [...goals, { text: newGoalText.trim(), completed: false }];
      
      if (!goalId) {
        // 새로 생성
        const response = await goalService.createYearlyGoal({
          year: currentYear,
          goals: newGoals
        });
        setGoalId(response.id);
        setGoals(response.goals);
      } else {
        // 업데이트
        const response = await goalService.updateYearlyGoal(goalId, {
          goals: newGoals
        });
        setGoals(response.goals);
      }
      
      closeAddModal();
      setNewGoalText('');
      showAlert('목표가 추가되었습니다.', { variant: 'success' });
    } catch (error) {
      showAlert(error.message || '목표 추가에 실패했습니다.');
    }
  };

  const handleEditGoal = (index) => {
    setEditingIndex(index);
    setEditingText(goals[index].text);
    setActiveMenuIndex(null);
    openEditModal();
  };

  const handleUpdateGoal = async () => {
    if (!editingText.trim()) {
      showAlert('목표를 입력해주세요.');
      return;
    }

    if (!goalId) {
      showAlert('목표를 먼저 저장해주세요.');
      return;
    }

    try {
      const newGoals = [...goals];
      newGoals[editingIndex] = { ...newGoals[editingIndex], text: editingText.trim() };
      
      const response = await goalService.updateYearlyGoal(goalId, {
        goals: newGoals
      });
      
      setGoals(response.goals);
      closeEditModal();
      setEditingIndex(null);
      setEditingText('');
      showAlert('목표가 수정되었습니다.', { variant: 'success' });
    } catch (error) {
      showAlert(error.message || '목표 수정에 실패했습니다.');
    }
  };

  const handleToggleGoal = async (index) => {
    if (!goalId) {
      showAlert('목표를 먼저 저장해주세요.');
      return;
    }

    try {
      const response = await goalService.toggleGoalItem(goalId, index);
      setGoals(response.goals);
      setActiveMenuIndex(null);
    } catch (error) {
      showAlert(error.message || '목표 상태 변경에 실패했습니다.');
    }
  };

  const handleDeleteGoal = async (index) => {
    if (!goalId) {
      showAlert('목표를 먼저 저장해주세요.');
      return;
    }

    const confirmed = await showConfirm(
      '정말로 이 목표를 삭제하시겠습니까?',
      {
        title: '목표 삭제',
        confirmText: '삭제',
        cancelText: '취소',
        variant: 'danger'
      }
    );

    if (!confirmed) return;

    try {
      const newGoals = goals.filter((_, i) => i !== index);
      
      if (newGoals.length === 0) {
        // 목표가 없으면 전체 삭제
        await goalService.deleteYearlyGoal(goalId);
        setGoals([]);
        setGoalId(null);
      } else {
        // 목표 업데이트
        const response = await goalService.updateYearlyGoal(goalId, {
          goals: newGoals
        });
        setGoals(response.goals);
      }
      
      setActiveMenuIndex(null);
      showAlert('목표가 삭제되었습니다.', { variant: 'success' });
    } catch (error) {
      showAlert(error.message || '목표 삭제에 실패했습니다.');
    }
  };

  const handleMenuClick = (index, e) => {
    e.stopPropagation();
    setActiveMenuIndex(activeMenuIndex === index ? null : index);
  };

  if (loading) {
    return (
      <GoalContainer>
        <GoalCard>
          <div style={{ textAlign: 'center', padding: '40px' }}>로딩 중...</div>
        </GoalCard>
      </GoalContainer>
    );
  }

  return (
    <GoalContainer>
      <GoalCard>
        <GoalHeader>
          <GoalTitle>{currentYear}년 목표</GoalTitle>
          <GoalDescription>
            {user?.nickname || '회원'}님의 {currentYear}년 목표를 설정하고 관리하세요.
          </GoalDescription>
        </GoalHeader>

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        {goals.length === 0 ? (
          <EmptyState>
            <EmptyStateText>아직 설정된 목표가 없습니다.</EmptyStateText>
            <EmptyStateText>목표 추가 버튼을 클릭하여 목표를 추가해보세요.</EmptyStateText>
          </EmptyState>
        ) : (
          <GoalsGrid>
            {goals.map((goal, index) => (
              <GoalItemCard
                key={index}
                $completed={goal.completed}
                onClick={() => setActiveMenuIndex(null)}
              >
                <GoalItemText $completed={goal.completed}>
                  {goal.text}
                </GoalItemText>
                <GoalItemFooter>
                  <GoalItemStatus $completed={goal.completed}>
                    {goal.completed ? (
                      <>
                        <IoCheckmarkCircle />
                        달성 완료
                      </>
                    ) : (
                      <>
                        <IoCloseCircle />
                        진행 중
                      </>
                    )}
                  </GoalItemStatus>
                  <div style={{ position: 'relative' }} ref={el => menuRefs.current[index] = el}>
                    <ActionMenuButton
                      onClick={(e) => handleMenuClick(index, e)}
                      aria-label="목표 액션 메뉴"
                    >
                      <IoEllipsisVertical />
                    </ActionMenuButton>
                    {activeMenuIndex === index && (
                      <ActionMenu>
                        <ActionMenuItem
                          onClick={() => handleToggleGoal(index)}
                          $variant={goal.completed ? 'default' : 'success'}
                        >
                          {goal.completed ? (
                            <>
                              <IoCloseCircle />
                              미완료로 변경
                            </>
                          ) : (
                            <>
                              <IoCheckmarkCircle />
                              달성 완료
                            </>
                          )}
                        </ActionMenuItem>
                        <ActionMenuItem
                          onClick={() => handleEditGoal(index)}
                        >
                          <IoCreate />
                          수정
                        </ActionMenuItem>
                        <ActionMenuItem
                          onClick={() => handleDeleteGoal(index)}
                          $variant="danger"
                        >
                          <IoTrash />
                          삭제
                        </ActionMenuItem>
                      </ActionMenu>
                    )}
                  </div>
                </GoalItemFooter>
              </GoalItemCard>
            ))}
          </GoalsGrid>
        )}

        <AddGoalButton onClick={handleAddGoalClick}>
          <IoAdd style={{ fontSize: '1.25rem' }} />
          목표 추가
        </AddGoalButton>
      </GoalCard>

      {/* 목표 추가 모달 */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        title="목표 추가"
        maxWidth="500px"
        actions={[
          {
            label: '취소',
            onClick: closeAddModal,
            variant: 'default'
          },
          {
            label: '추가',
            onClick: handleAddGoal,
            variant: 'primary'
          }
        ]}
      >
        <ModalInput
          type="text"
          placeholder="목표를 입력하세요"
          value={newGoalText}
          onChange={(e) => setNewGoalText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddGoal();
            }
          }}
          autoFocus
        />
      </Modal>

      {/* 목표 수정 모달 */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="목표 수정"
        maxWidth="500px"
        actions={[
          {
            label: '취소',
            onClick: closeEditModal,
            variant: 'default'
          },
          {
            label: '저장',
            onClick: handleUpdateGoal,
            variant: 'primary'
          }
        ]}
      >
        <ModalInput
          type="text"
          placeholder="목표를 입력하세요"
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleUpdateGoal();
            }
          }}
          autoFocus
        />
      </Modal>

      <Alert isOpen={isAlertOpen} {...alertProps} />
      <Confirm isOpen={isConfirmOpen} {...confirmProps} />
    </GoalContainer>
  );
};

export default GoalPage;
