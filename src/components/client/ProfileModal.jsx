import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, Save, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/authService';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, login } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sync data khi mở modal
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '' // Luôn bỏ trống khi mở
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Lọc các trường có thay đổi hoặc có giá trị
    const updatePayload = {};
    if (formData.username && formData.username !== user.username) {
      updatePayload.username = formData.username;
    }
    if (formData.email && formData.email !== user.email) {
      updatePayload.email = formData.email;
    }
    if (formData.password) {
      updatePayload.password = formData.password;
    }

    // Nếu không có gì thay đổi
    if (Object.keys(updatePayload).length === 0) {
      toast.error('Không có thông tin nào được thay đổi.');
      return;
    }

    if (!user?.id) {
      toast.error('Lỗi: Không tìm thấy ID người dùng!');
      return;
    }

    setIsLoading(true);

    try {
      const updatedUser = await authService.updateProfile(user.id, updatePayload);
      
      // Lấy token cũ để tái đăng nhập vào store
      const token = localStorage.getItem('access_token');
      
      // Cập nhật thông tin vào Zustand store (giả định action login có nhận cả user data và token)
      login(updatedUser, token);

      toast.success('Cập nhật thông tin thành công!');
      onClose();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Cập nhật thất bại. Vui lòng thử lại sau.';
      if (Array.isArray(errorMsg)) {
        toast.error(errorMsg[0]?.msg || 'Dữ liệu không hợp lệ!');
      } else if (typeof errorMsg === 'string') {
        toast.error(errorMsg);
      } else {
        toast.error('Cập nhật thất bại!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#FAF5EC] shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200/50 px-6 py-4">
          <h2 className="font-serif text-xl font-bold text-[#2A1610]">
            Thông tin tài khoản
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-200/50 hover:text-stone-800 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Tên hiển thị
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
              placeholder="Nhập tên hiển thị..."
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
              placeholder="Nhập địa chỉ email..."
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Mật khẩu mới (Tùy chọn)
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
              placeholder="Nhập mật khẩu mới nếu muốn đổi..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200/50 focus:outline-none"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-[#7A1E24] px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-[#63181d] focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
