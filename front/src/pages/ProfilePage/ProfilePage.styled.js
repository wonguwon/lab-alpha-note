import styled from 'styled-components';
import { flexCenter, flexColumn } from '../../styles/mixins';

/* 프로필 페이지 컨테이너 */
export const ProfileContainer = styled.div`
  ${flexCenter}
  min-height: calc(100vh - 140px);
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.gray[50]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    min-height: calc(100vh - 200px);
    margin-bottom: -60px;
  }
`;

/* 프로필 카드 */
export const ProfileCard = styled.div`
  background: transparent;
  padding: ${props => props.theme.spacing[8]};
  width: 100%;
  max-width: 520px;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing[6]};
    margin: ${props => props.theme.spacing[4]};
  }
`;

/* 프로필 헤더 */
export const ProfileHeader = styled.div`
  ${flexColumn}
  align-items: center;
  margin-bottom: ${props => props.theme.spacing[6]};
`;

/* 로고 텍스트 */
export const LogoText = styled.h1`
  color: ${props => props.theme.colors.primary[600]};
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  letter-spacing: -0.02em;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.8rem;
    margin: 0 0 ${props => props.theme.spacing[3]} 0;
  }
`;

/* 프로필 설명 */
export const ProfileDescription = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 ${props => props.theme.spacing[6]} 0;
  text-align: center;
  line-height: 1.6;
  letter-spacing: -0.01em;

  br {
    display: block;
    margin: 4px 0;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 0.9rem;
    margin: 0 0 ${props => props.theme.spacing[4]} 0;
  }
`;

/* 프로필 폼 */
export const ProfileForm = styled.form`
  ${flexColumn}
  gap: ${props => props.theme.spacing[4]};
`;

/* 프로필 이미지 섹션 */
export const ProfileImageSection = styled.div`
  ${flexCenter}
  margin-bottom: ${props => props.theme.spacing[2]};
`;

/* 프로필 이미지 래퍼 */
export const ProfileImageWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid ${props => props.theme.colors.gray[200]};
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    border-color: ${props => props.theme.colors.primary[600]};
  }
`;

/* 프로필 이미지 */
export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

/* 프로필 이미지 오버레이 */
export const ProfileImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  ${flexCenter}
  opacity: 0;
  transition: opacity ${props => props.theme.transitions.base};

  ${ProfileImageWrapper}:hover & {
    opacity: 1;
  }

  span {
    color: white;
    font-size: ${props => props.theme.fonts.size.sm};
    font-weight: ${props => props.theme.fonts.weight.medium};
  }
`;

/* 프로필 이미지 입력 (숨김) */
export const ProfileImageInput = styled.input`
  display: none;
`;

/* 입력 그룹 */
export const InputGroup = styled.div`
  ${flexColumn}
  gap: ${props => props.theme.spacing[1]};
`;

/* 라벨 */
export const Label = styled.label`
  color: ${props => props.theme.colors.gray[700]};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
`;

/* 입력 필드 */
export const Input = styled.input`
  padding: ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  transition: all ${props => props.theme.transitions.base};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.gray[400]};
    box-shadow: 0 0 0 1px ${props => props.theme.colors.gray[300]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`;

/* 비활성화된 입력 필드 */
export const DisabledInput = styled(Input)`
  background: ${props => props.theme.colors.gray[100]};
  color: ${props => props.theme.colors.gray[500]};
  cursor: not-allowed;
`;

/* 토글 섹션 */
export const ToggleSection = styled.div`
  margin: ${props => props.theme.spacing[2]} 0;
`;

/* 토글 라벨 */
export const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${props => props.theme.spacing[3]};
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[600]};
  line-height: 1.4;
  cursor: pointer;

  span {
    flex: 1;
  }
`;

/* 토글 스위치 */
export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  flex-shrink: 0;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

/* 토글 슬라이더 */
export const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.colors.gray[300]};
  transition: 0.3s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }

  input:checked + & {
    background-color: ${props => props.theme.colors.primary[600]};
  }

  input:checked + &:before {
    transform: translateX(24px);
  }
`;

/* 버튼 그룹 */
export const ButtonGroup = styled.div`
  margin-top: ${props => props.theme.spacing[2]};
`;

/* 저장 버튼 */
export const SaveButton = styled.button`
  ${flexCenter}
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.primary[600]};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: background ${props => props.theme.transitions.base};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary[700]};
  }

  &:disabled {
    background: ${props => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

/* 위험 구역 */
export const DangerSection = styled.div`
  margin-top: ${props => props.theme.spacing[8]};
  padding-top: ${props => props.theme.spacing[6]};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
  ${flexColumn}
  gap: ${props => props.theme.spacing[2]};
`;

/* 위험 버튼 */
export const DangerButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  background: ${props => props.$danger ? props.theme.colors.gray[100] : props.theme.colors.gray[100]};
  color: ${props => props.$danger ? '#e74c3c' : props.theme.colors.gray[700]};
  border: 1px solid ${props => props.$danger ? '#e74c3c' : props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.$danger ? '#ffe6e6' : props.theme.colors.gray[200]};
  }
`;

/* 회원탈퇴 안내 */
export const WithdrawalNotice = styled.div`
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[4]};
`;

/* 안내 제목 */
export const NoticeTitle = styled.h3`
  margin: 0 0 ${props => props.theme.spacing[2]} 0;
  font-size: ${props => props.theme.fonts.size.base};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: #856404;
`;

/* 안내 텍스트 */
export const NoticeText = styled.p`
  margin: ${props => props.theme.spacing[2]} 0;
  font-size: ${props => props.theme.fonts.size.sm};
  color: #856404;
  line-height: 1.6;

  strong {
    font-weight: ${props => props.theme.fonts.weight.bold};
  }
`;

/* 모달 오버레이 */
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  ${flexCenter}
  z-index: 1000;
`;

/* 모달 컨텐츠 */
export const ModalContent = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

/* 모달 헤더 */
export const ModalHeader = styled.div`
  padding: ${props => props.theme.spacing[5]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
`;

/* 모달 바디 */
export const ModalBody = styled.div`
  padding: ${props => props.theme.spacing[5]};
  ${flexColumn}
  gap: ${props => props.theme.spacing[3]};
`;

/* 모달 푸터 */
export const ModalFooter = styled.div`
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[5]};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing[2]};
`;

/* 모달 버튼 */
export const ModalButton = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  background: ${props =>
    props.$primary ? props.theme.colors.primary[600] :
    props.$danger ? '#e74c3c' :
    props.theme.colors.gray[200]
  };
  color: ${props =>
    props.$primary || props.$danger ?
    props.theme.colors.white :
    props.theme.colors.gray[700]
  };
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover:not(:disabled) {
    background: ${props =>
      props.$primary ? props.theme.colors.primary[700] :
      props.$danger ? '#c0392b' :
      props.theme.colors.gray[300]
    };
  }

  &:disabled {
    background: ${props => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

/* 비밀번호 입력 그룹 */
export const PasswordInputGroup = styled.div`
  ${flexColumn}
  gap: ${props => props.theme.spacing[1]};
`;
