import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPersonCircle, IoCloseCircle } from 'react-icons/io5';
import useAuthStore from '../../store/authStore';
import { userService, storageService } from '../../api/services';
import { getImageUrl } from '../../utils/imageHelper';
import { validatePassword, PASSWORD_RULES } from '../../utils/passwordValidator';
import { Alert, Confirm } from '../../components/common/Modal';
import { useAlert, useConfirm } from '../../hooks/useModal';
import { ButtonSpinner } from '../../components/common/Loading';
import {
  ProfileContainer,
  ProfileCard,
  ProfileHeader,
  LogoText,
  ProfileDescription,
  ProfileForm,
  ProfileImageSection,
  ProfileImageWrapper,
  ProfileImage,
  ProfileImageOverlay,
  ProfileImageInput,
  InputGroup,
  Label,
  Input,
  DisabledInput,
  ButtonGroup,
  SaveButton,
  DangerSection,
  DangerButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  PasswordInputGroup
} from './ProfilePage.styled';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  // Alert & Confirm hooks
  const { isOpen: isAlertOpen, showAlert, alertProps } = useAlert();
  const { isOpen: isConfirmOpen, showConfirm, confirmProps } = useConfirm();

  // 비밀번호 변경 모달 상태
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [newPasswordValidation, setNewPasswordValidation] = useState(null);

  // 새 비밀번호 실시간 검증
  useEffect(() => {
    if (newPassword) {
      const validation = validatePassword(newPassword, user?.email);
      setNewPasswordValidation(validation);
    } else {
      setNewPasswordValidation(null);
    }
  }, [newPassword, user?.email]);

  // 회원탈퇴 모달 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // 프로필 정보 로드
  useEffect(() => {
    if (user) {
      // 로그인한 사용자 정보에서 설정
      setEmail(user.email || '');
      setNickname(user.nickname || '');

      // 프로필 이미지가 있으면 설정
      if (user.profileImageUrl) {
        setProfileImagePreview(getImageUrl(user.profileImageUrl));
      }
    }
  }, [user]);

  // 프로필 이미지 변경 핸들러
  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  // 프로필 이미지 삭제
  const handleDeleteProfileImage = async () => {
    if (!profileImagePreview) return;

    const confirmed = await showConfirm('프로필 이미지를 삭제하시겠습니까?', {
      title: '이미지 삭제',
      confirmText: '삭제',
      variant: 'danger'
    });

    if (!confirmed) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const updatedUser = await userService.deleteProfileImage();
      setUser(updatedUser);
      setProfileImagePreview(null);
      showAlert('프로필 이미지가 삭제되었습니다.', { variant: 'success' });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('이미지 파일은 5MB 이하만 업로드 가능합니다.');
      return;
    }

    // 파일 형식 체크
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('지원하지 않는 파일 형식입니다. (jpg, jpeg, png, gif만 가능)');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // userId가 필요하므로 user 객체에서 가져옴
      const updatedUser = await userService.uploadProfileImage(file, user.id);
      setUser(updatedUser);
      setProfileImagePreview(getImageUrl(updatedUser.profileImageUrl));
      showAlert('프로필 이미지가 업로드되었습니다.', { variant: 'success' });
    } catch (error) {
      setErrorMessage(error.message || '프로필 이미지 업로드에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 프로필 저장 (닉네임만)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nickname.trim()) {
      setErrorMessage('닉네임을 입력해주세요.');
      return;
    }

    if (nickname.length > 20) {
      setErrorMessage('닉네임은 최대 20자까지 입력 가능합니다.');
      return;
    }

    setIsLoading(true);

    try {
      const updatedUser = await userService.updateProfile({ nickname });
      setUser(updatedUser);
      showAlert('프로필이 업데이트되었습니다.', { variant: 'success' });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 변경
  const handlePasswordChange = async () => {
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('모든 필드를 입력해주세요.');
      return;
    }

    // 새 비밀번호 검증
    const passwordCheck = validatePassword(newPassword, user?.email);
    if (!passwordCheck.isValid) {
      setPasswordError('새 비밀번호가 보안 요구사항을 충족하지 않습니다.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      await userService.updatePassword(currentPassword, newPassword);
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      showAlert('비밀번호가 변경되었습니다.', { variant: 'success' });
    } catch (error) {
      setPasswordError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 회원탈퇴
  const handleDeleteAccount = async () => {
    setDeleteError('');

    // LOCAL 사용자인 경우 비밀번호 확인
    if (user?.provider === 'LOCAL') {
      if (!deletePassword) {
        setDeleteError('비밀번호를 입력해주세요.');
        return;
      }
    }

    setIsLoading(true);

    try {
      // 회원탈퇴 API 호출
      await userService.deleteAccount(deletePassword, deleteReason);
      // 로그아웃 및 로그인 페이지로 이동
      useAuthStore.getState().logout();
      navigate('/login');
      showAlert('회원탈퇴가 완료되었습니다.');
    } catch (error) {
      setDeleteError(error.message || '회원탈퇴에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <LogoText>회원정보</LogoText>
        </ProfileHeader>

        <ProfileForm onSubmit={handleSaveProfile}>
          {/* 프로필 이미지 */}
          <ProfileImageSection>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <ProfileImageWrapper onClick={handleProfileImageClick}>
                {profileImagePreview ? (
                  <>
                    <ProfileImage
                      src={profileImagePreview}
                      alt="프로필 이미지"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <IoPersonCircle style={{
                      width: '120px',
                      height: '120px',
                      display: 'none',
                      color: '#6b7280'
                    }} />
                  </>
                ) : (
                  <IoPersonCircle style={{
                    width: '100%',
                    height: '100%',
                    color: '#6b7280'
                  }} />
                )}
                <ProfileImageOverlay>
                  <span>프로필 변경</span>
                </ProfileImageOverlay>
              </ProfileImageWrapper>

              {/* 이미지 삭제 버튼 (오른쪽 위) */}
              {profileImagePreview && (
                <IoCloseCircle
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProfileImage();
                  }}
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    fontSize: '32px',
                    color: '#e74c3c',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              )}
            </div>

            <ProfileImageInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
          </ProfileImageSection>

          {/* 이메일 (수정 불가) */}
          <InputGroup>
            <Label htmlFor="email">이메일</Label>
            <DisabledInput
              id="email"
              type="email"
              value={email}
              disabled
            />
          </InputGroup>

          {/* 닉네임 */}
          <InputGroup>
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </InputGroup>

          {errorMessage && (
            <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '8px' }}>
              {errorMessage}
            </div>
          )}

          {/* 저장 버튼 */}
          <ButtonGroup>
            <SaveButton type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  저장 중
                  <ButtonSpinner size="small" />
                </>
              ) : (
                '변경사항 저장'
              )}
            </SaveButton>
          </ButtonGroup>
        </ProfileForm>

        {/* 비밀번호 변경 (LOCAL 사용자만) */}
        {user?.provider === 'LOCAL' && (
          <DangerSection>
            <DangerButton type="button" onClick={() => setShowPasswordModal(true)}>
              비밀번호 변경
            </DangerButton>
          </DangerSection>
        )}

        {/* 회원탈퇴 */}
        <DangerSection>
          <DangerButton type="button" onClick={() => setShowDeleteModal(true)} style={{ backgroundColor: '#c0392b', color: 'white', borderColor: '#c0392b' }}>
            회원탈퇴
          </DangerButton>
        </DangerSection>
      </ProfileCard>

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <ModalOverlay onClick={() => {
          setShowPasswordModal(false);
          setPasswordError('');
        }}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>비밀번호 변경</ModalHeader>
            <ModalBody>
              <PasswordInputGroup>
                <Label htmlFor="currentPassword">현재 비밀번호</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="현재 비밀번호를 입력하세요"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </PasswordInputGroup>
              <PasswordInputGroup>
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="새 비밀번호를 입력하세요"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {/* 비밀번호 검증 규칙 표시 */}
                {newPassword && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    lineHeight: '1.6'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '8px', color: '#495057' }}>
                      비밀번호 보안 요구사항
                    </div>
                    {PASSWORD_RULES.map((rule) => {
                      const isValid = newPasswordValidation?.[rule.key];
                      return (
                        <div key={rule.key} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '4px',
                          color: isValid ? '#27ae60' : '#95a5a6'
                        }}>
                          <span style={{ fontSize: '0.75rem' }}>
                            {isValid ? '✓' : '○'}
                          </span>
                          <span>{rule.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </PasswordInputGroup>
              <PasswordInputGroup>
                <Label htmlFor="confirmNewPassword">새 비밀번호 확인</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="새 비밀번호를 다시 입력하세요"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                {/* 비밀번호 일치 여부 표시 */}
                {confirmNewPassword && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '0.8125rem',
                    color: newPassword === confirmNewPassword ? '#27ae60' : '#e74c3c'
                  }}>
                    {newPassword === confirmNewPassword ? '✓ 비밀번호가 일치합니다' : '✗ 비밀번호가 일치하지 않습니다'}
                  </div>
                )}
              </PasswordInputGroup>
              {passwordError && (
                <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '8px' }}>
                  {passwordError}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <ModalButton onClick={() => {
                setShowPasswordModal(false);
                setPasswordError('');
              }}>취소</ModalButton>
              <ModalButton $primary onClick={handlePasswordChange} disabled={isLoading}>
                {isLoading ? (
                  <>
                    변경 중
                    <ButtonSpinner size="small" />
                  </>
                ) : (
                  '변경'
                )}
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* 회원탈퇴 확인 모달 */}
      {showDeleteModal && (
        <ModalOverlay onClick={() => setShowDeleteModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>회원탈퇴</ModalHeader>
            <ModalBody>
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontWeight: '600', marginBottom: '8px', fontSize: '0.95rem' }}>
                  회원탈퇴 시 아래 내용을 확인해주세요.
                </p>
                <ul style={{
                  margin: '0',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  color: '#4b5563'
                }}>
                  <li style={{ marginBottom: '6px' }}>
                    탈퇴 시 계정 정보(이메일, 닉네임 등)는 <strong>60일간 보관</strong>되며, 이 기간 동안 계정이 잠금 상태로 유지됩니다.
                  </li>
                  <li style={{ marginBottom: '6px' }}>
                    60일 경과 후 모든 개인정보는 <strong>완전히 삭제</strong>되며 복구할 수 없습니다.
                  </li>
                  <li>
                    작성한 게시물은 삭제되지 않으며, 익명 처리 후 AlphaNote에 귀속됩니다.
                  </li>
                </ul>
              </div>

              <div style={{
                padding: '10px 12px',
                backgroundColor: '#fef2f2',
                borderRadius: '6px',
                border: '1px solid #fecaca',
                marginBottom: '12px'
              }}>
                <p style={{
                  color: '#dc2626',
                  fontSize: '0.875rem',
                  margin: 0,
                  lineHeight: '1.5',
                  fontWeight: '500'
                }}>
                  이 작업은 되돌릴 수 없습니다.
                </p>
              </div>

              {/* LOCAL 사용자만 비밀번호 입력 */}
              {user?.provider === 'LOCAL' && (
                <PasswordInputGroup style={{ marginBottom: '12px' }}>
                  <Label htmlFor="deletePassword">비밀번호 확인</Label>
                  <Input
                    id="deletePassword"
                    type="password"
                    placeholder="현재 비밀번호를 입력하세요"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                  />
                </PasswordInputGroup>
              )}

              {/* 탈퇴 사유 입력 */}
              <InputGroup>
                <Label htmlFor="deleteReason">탈퇴 사유 (선택)</Label>
                <Input
                  id="deleteReason"
                  type="text"
                  placeholder="탈퇴 사유를 간단히 적어주세요 (선택사항)"
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  maxLength={100}
                />
              </InputGroup>

              {deleteError && (
                <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '8px' }}>
                  {deleteError}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <ModalButton onClick={() => {
                setShowDeleteModal(false);
                setDeletePassword('');
                setDeleteReason('');
                setDeleteError('');
              }}>취소</ModalButton>
              <ModalButton
                onClick={handleDeleteAccount}
                disabled={isLoading}
                style={{ backgroundColor: '#c0392b', color: 'white' }}
              >
                {isLoading ? (
                  <>
                    처리 중
                    <ButtonSpinner size="small" />
                  </>
                ) : (
                  '탈퇴하기'
                )}
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Alert 및 Confirm 컴포넌트 */}
      <Alert isOpen={isAlertOpen} {...alertProps} />
      <Confirm isOpen={isConfirmOpen} {...confirmProps} />

    </ProfileContainer>
  );
};

export default ProfilePage;
