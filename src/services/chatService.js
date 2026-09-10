import api from './api.js';

// Hàm tạo phiên chat mới
export const createSession = async (title = "Phiên trò chuyện mới") => {
  const token = localStorage.getItem('access_token');
  const response = await api.post(
    '/api/v1/chat/sessions',
    { title },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

// Hàm lấy danh sách các phiên chat
export const fetchSessions = async () => {
  // Tạm thời mock trả về mảng rỗng hoặc cấu trúc sẵn API thật
  // const token = localStorage.getItem('access_token');
  // const response = await api.get('/api/v1/chat/sessions', { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;
  return [];
};
