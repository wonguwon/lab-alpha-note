import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // 상태
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 로그인 액션 (쿠키가 자동으로 설정되므로 사용자 정보만 저장)
      login: () => {
        set({
          isAuthenticated: true,
          error: null
        });
      },

      // 로그아웃 액션
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null
        });
      },

      // 사용자 정보 업데이트
      setUser: (user) => {
        set({ 
          user,
          isAuthenticated: !!user
        });
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
        const { user, isAuthenticated } = get();
        return !!user || isAuthenticated;
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
