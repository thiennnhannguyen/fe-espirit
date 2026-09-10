import api from './api.js';

// Helper dùng chung để trích xuất Admin Token an toàn
const getAdminToken = () => {
  let token = null;
  const espiritAuthRaw = localStorage.getItem('espirit_auth') || sessionStorage.getItem('espirit_auth');
  if (espiritAuthRaw) {
    try {
      const espiritAuth = JSON.parse(espiritAuthRaw);
      token = espiritAuth?.access_token || espiritAuth?.token;
    } catch (e) {}
  }
  if (!token) {
    token = localStorage.getItem('access_token');
  }
  return token;
};

export const getAllUsers = async (skip = 0, limit = 100) => {
  const token = getAdminToken();
  if (!token) throw new Error("Không tìm thấy Token. Vui lòng đăng nhập lại!");

  const response = await api.get('/api/v1/users/', {
    params: { skip, limit },
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const getUserById = async (id) => {
  const token = getAdminToken();
  if (!token) throw new Error("Không tìm thấy Token. Vui lòng đăng nhập lại!");

  const response = await api.get(`/api/v1/users/${id}`, {
    headers: { 
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteUser = async (id) => {
  const token = getAdminToken();
  if (!token) throw new Error("Không tìm thấy Token. Vui lòng đăng nhập lại!");

  const response = await api.delete(`/api/v1/users/${id}`, {
    headers: { 
      'Authorization': `Bearer ${token}`
    }
  });
  // API xóa thành công sẽ trả về 204 No Content
  return response.status === 204;
};

export const updateUser = async (id, updateData) => {
  const token = getAdminToken();
  if (!token) throw new Error("Không tìm thấy Token. Vui lòng đăng nhập lại!");

  const response = await api.patch(`/api/v1/users/${id}`, updateData, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export default {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser
};
