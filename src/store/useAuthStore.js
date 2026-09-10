import { create } from 'zustand';

// Lấy thông tin user và token từ localStorage (nếu có) khi khởi tạo app
const storedUser = JSON.parse(localStorage.getItem('user_info')) || null;
const storedToken = localStorage.getItem('access_token') || null;

export const useAuthStore = create((set) => ({
  user: storedUser,
  isAuthenticated: !!storedToken,

  // Action: Đăng nhập
  login: (userData, token) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_info', JSON.stringify(userData));
    set({ user: userData, isAuthenticated: true });
  },

  // Action: Đăng xuất
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    set({ user: null, isAuthenticated: false });
  },
}));
