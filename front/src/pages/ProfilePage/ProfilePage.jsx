import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPersonCircle, IoCloseCircle } from 'react-icons/io5';
import useAuthStore from '../../store/authStore';
import { userService, storageService } from '../../api/services';
import { getImageUrl } from '../../utils/imageHelper';
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

  // 비밀번호 변경 모달 상태
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  console.log(profileImagePreview)

  // 프로필 정보 로드
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // 로그인한 사용자 정보에서 설정
    setEmail(user.email || '');
    setNickname(user.nickname || '');

    // 프로필 이미지가 있으면 설정 (URL 헬퍼 함수 사용)
    if (user.profileImageUrl) {
      setProfileImagePreview(getImageUrl(user.profileImageUrl));
    }
  }, [user, navigate]);

  // 프로필 이미지 변경 핸들러
  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  // 프로필 이미지 삭제
  const handleDeleteProfileImage = async () => {
    if (!profileImagePreview) return;

    if (!confirm('프로필 이미지를 삭제하시겠습니까?')) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const updatedUser = await userService.deleteProfileImage();
      setUser(updatedUser);
      setProfileImagePreview(null);
      alert('프로필 이미지가 삭제되었습니다.');
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
      alert('프로필 이미지가 업로드되었습니다.');
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
      alert('프로필이 업데이트되었습니다.');
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

    if (newPassword !== confirmNewPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);

    try {
      await userService.updatePassword(currentPassword, newPassword);
      alert('비밀번호가 변경되었습니다.');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      setPasswordError(error.message);
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
              {isLoading ? '저장 중...' : '변경사항 저장'}
            </SaveButton>
          </ButtonGroup>
        </ProfileForm>

        {/* 비밀번호 변경 */}
        <DangerSection>
          <DangerButton type="button" onClick={() => setShowPasswordModal(true)}>
            비밀번호 변경
          </DangerButton>
        </DangerSection>
      </ProfileCard>

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <ModalOverlay onClick={() => setShowPasswordModal(false)}>
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
              </PasswordInputGroup>
              {passwordError && (
                <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '8px' }}>
                  {passwordError}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <ModalButton onClick={() => setShowPasswordModal(false)}>취소</ModalButton>
              <ModalButton $primary onClick={handlePasswordChange} disabled={isLoading}>
                {isLoading ? '변경 중...' : '변경'}
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

    </ProfileContainer>
  );
};

export default ProfilePage;
