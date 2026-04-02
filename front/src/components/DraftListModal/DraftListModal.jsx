import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import { growthLogService } from '../../api/services';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  DraftList,
  DraftItem,
  DraftInfo,
  DraftTitle,
  DraftDate,
  DeleteButton,
  EmptyState,
  EmptyIcon,
  EmptyText,
  LoadingState
} from './DraftListModal.styled';

const DraftListModal = ({ isOpen, onClose, onDraftDeleted }) => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDrafts();
    }
  }, [isOpen]);

  const loadDrafts = async () => {
    setLoading(true);
    try {
      const response = await growthLogService.getMyGrowthLogs({
        status: 'DRAFT',
        sort: 'createdAt,desc',
        size: 50
      });

      if (response && response.content) {
        setDrafts(response.content);
      } else if (Array.isArray(response)) {
        setDrafts(response);
      }
    } catch (error) {
      console.error('임시저장 목록 조회 실패:', error);
      alert('임시저장 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDraftClick = (draftId) => {
    navigate(`/growth-logs/${draftId}/edit`);
    onClose();
  };

  const handleDelete = async (e, draftId) => {
    e.stopPropagation();

    if (!window.confirm('이 임시저장 글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await growthLogService.deleteGrowthLog(draftId);
      setDrafts(drafts.filter(draft => draft.id !== draftId));

      if (onDraftDeleted) {
        onDraftDeleted();
      }

      alert('임시저장 글이 삭제되었습니다.');
    } catch (error) {
      console.error('임시저장 글 삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>임시저장 목록</ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {loading ? (
            <LoadingState>불러오는 중...</LoadingState>
          ) : drafts.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📝</EmptyIcon>
              <EmptyText>임시저장된 글이 없습니다</EmptyText>
            </EmptyState>
          ) : (
            <DraftList>
              {drafts.map(draft => (
                <DraftItem
                  key={draft.id}
                  onClick={() => handleDraftClick(draft.id)}
                >
                  <DraftInfo>
                    <DraftTitle>{draft.title || '제목 없음'}</DraftTitle>
                    <DraftDate>
                      {new Date(draft.updatedAt || draft.createdAt).toLocaleString()}
                    </DraftDate>
                  </DraftInfo>
                  <DeleteButton onClick={(e) => handleDelete(e, draft.id)}>
                    삭제
                  </DeleteButton>
                </DraftItem>
              ))}
            </DraftList>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DraftListModal;
