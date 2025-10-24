import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // 상태
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 로그인 액션
      login: async (token, user) => {
        set({
          token,
          user,
          isAuthenticated: true,
          error: null
        });
      },

      // 로그아웃 액션
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      // 사용자 정보 업데이트
      setUser: (user) => {
        set({ user });
      },

      // 로딩 상태 설정
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // 에러 설정
      setError: (error) => {
        set({ error });
      },

      // 에러 초기화
      clearError: () => {
        set({ error: null });
      },

      // 인증 상태 확인
      checkAuth: () => {
        const { token } = get();
        return !!token;
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
