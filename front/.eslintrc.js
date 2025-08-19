module.exports = {
  env: {
    browser: true, // 브라우저 전역 객체(window 등)를 사용할 수 있게 설정
    es2021: true,// 최신 ES2021 문법을 허용
    node: true,// Node.js 환경에서도 돌아가도록 설정 (예: process 사용)
  },
  extends: [
    'eslint:recommended',// ESLint 기본 권장 규칙 사용
    'plugin:react/recommended',// React 관련 규칙 기본 제공
    'plugin:prettier/recommended',// Prettier와 충돌하는 ESLint 규칙 제거 + Prettier 오류를 ESLint 오류로 처리
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,// JSX 문법을 파싱할 수 있게 설정
    },
    ecmaVersion: 'latest',// 최신 ECMAScript 버전 지원 (예: ES2022+)
    sourceType: 'module',// import/export를 사용할 수 있게 모듈 소스 타입 지정
  },
  plugins: [
    'react',        // React 관련 규칙 활성화
    'react-hooks',  // React Hooks 관련 규칙 활성화
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',// React 17+에서는 자동 import가 필요 없기 때문에 꺼줌
    'react/prop-types': 'off',// PropTypes 사용을 강제하지 않음
    'react-hooks/rules-of-hooks': 'error',// Hooks 규칙 위반은 에러 처리 (useEffect, useState 등 사용 규칙)
    'react-hooks/exhaustive-deps': 'warn',// useEffect 등에서 의존성 배열 누락 시 경고
  },
  settings: {
    react: {
      version: 'detect',// 설치된 React 버전을 자동 감지 (버전에 따라 적절한 규칙 적용됨)
    },
  },
};