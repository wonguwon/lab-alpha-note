/**
 * 비밀번호 검증 유틸리티
 */

/**
 * 비밀번호 규칙별 검증 결과
 * @typedef {Object} PasswordValidationResult
 * @property {boolean} length - 8~20자 사이
 * @property {boolean} complexity - 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합
 * @property {boolean} noRepeat - 동일 문자 3회 이상 반복 금지
 * @property {boolean} noPersonalInfo - 아이디/이메일 일부 포함 금지
 * @property {boolean} noSpace - 공백 문자 불가
 * @property {boolean} isValid - 전체 유효성
 */

/**
 * 비밀번호 유효성 검사
 * @param {string} password - 검증할 비밀번호
 * @param {string} email - 사용자 이메일 (선택)
 * @returns {PasswordValidationResult}
 */
export const validatePassword = (password, email = '') => {
  const result = {
    length: false,
    complexity: false,
    noRepeat: false,
    noPersonalInfo: false,
    noSpace: false,
    isValid: false
  };

  if (!password) {
    return result;
  }

  // 1. 8~20자 사이
  result.length = password.length >= 8 && password.length <= 20;

  // 2. 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const complexity = [hasLowercase, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
  result.complexity = complexity >= 3;

  // 3. 동일 문자 3회 이상 반복 금지
  result.noRepeat = !/(.)\1{2,}/.test(password);

  // 4. 아이디/이메일 일부 포함 금지
  if (email) {
    const emailId = email.split('@')[0].toLowerCase();
    const passwordLower = password.toLowerCase();

    // 이메일 아이디가 3자 이상이고, 비밀번호에 3자 이상 연속으로 포함되어 있는지 확인
    if (emailId.length >= 3) {
      result.noPersonalInfo = !passwordLower.includes(emailId.substring(0, Math.min(emailId.length, 5)));
    } else {
      result.noPersonalInfo = true;
    }
  } else {
    result.noPersonalInfo = true; // 이메일 정보가 없으면 통과
  }

  // 5. 공백 문자 불가
  result.noSpace = !/\s/.test(password);

  // 전체 유효성
  result.isValid = result.length && result.complexity && result.noRepeat && result.noPersonalInfo && result.noSpace;

  return result;
};

/**
 * 비밀번호 검증 규칙 목록 (UI 표시용)
 */
export const PASSWORD_RULES = [
  { key: 'length', label: '8~20자 사이' },
  { key: 'complexity', label: '영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합' },
  { key: 'noRepeat', label: '동일 문자 3회 이상 반복 금지 (예: aaa, 111)' },
  { key: 'noPersonalInfo', label: '이메일 일부 포함 금지' },
  { key: 'noSpace', label: '공백 문자 불가' }
];

/**
 * 비밀번호 강도 계산 (0-100)
 * @param {string} password
 * @returns {number}
 */
export const getPasswordStrength = (password) => {
  if (!password) return 0;

  let strength = 0;

  // 길이 (최대 30점)
  if (password.length >= 8) strength += 10;
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;

  // 복잡도 (각 20점, 최대 80점)
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 25;

  return Math.min(100, strength);
};

/**
 * 비밀번호 강도 레벨 반환
 * @param {number} strength
 * @returns {{level: string, color: string, text: string}}
 */
export const getPasswordStrengthLevel = (strength) => {
  if (strength < 40) {
    return { level: 'weak', color: '#e74c3c', text: '약함' };
  } else if (strength < 70) {
    return { level: 'medium', color: '#f39c12', text: '보통' };
  } else {
    return { level: 'strong', color: '#27ae60', text: '강함' };
  }
};
