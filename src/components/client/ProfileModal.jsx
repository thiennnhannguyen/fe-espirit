import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, Save, Loader2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/authService';
import { deleteUser } from '../../services/adminUserService'; // Hàm delete đã có sẵn ở đây

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar_url: '',
    password: ''
  });
  const [initialData, setInitialData] = useState(null); // Để đối chiếu Dirty state
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // State cho nút xóa tài khoản

  // Sync data khi mở modal
  useEffect(() => {
    if (isOpen && user) {
      const init = {
        username: user.username || '',
        email: user.email || '',
        avatar_url: user.avatar_url || '',
        password: '' // Luôn bỏ trống khi mở
      };
      setFormData(init);
      setInitialData(init);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (!initialData) {
      onClose();
      return;
    }

    const isDirty = 
      formData.username !== initialData.username ||
      formData.email !== initialData.email ||
      formData.avatar_url !== initialData.avatar_url ||
      (formData.password && formData.password.trim() !== '');

    if (isDirty) {
      const confirmClose = window.confirm("Bạn có những thay đổi chưa được lưu. Bạn có chắc chắn muốn thoát không?");
      if (confirmClose) {
        setFormData(initialData); // reset state trước khi đóng
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleOverlayMouseDown = (e) => {
    // Chỉ đóng khi click chính xác vào viền mờ (chứ không phải click bên trong Modal form)
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isDirty = 
      formData.username !== initialData.username ||
      formData.email !== initialData.email ||
      formData.avatar_url !== initialData.avatar_url ||
      (formData.password && formData.password.trim() !== '');

    if (!isDirty) {
      toast.error('Không có thông tin nào được thay đổi.');
      return;
    }

    // BẢO MẬT: Tuyệt đối chỉ nhặt các trường cho phép, Không bao giờ gửi Role
    // Vì là PUT request, ta luôn gửi kèm username và email hiện hành
    const updatePayload = {
      username: formData.username,
      email: formData.email
    };

    if (formData.avatar_url !== initialData.avatar_url) {
      updatePayload.avatar_url = formData.avatar_url;
    }
    if (formData.password && formData.password.trim() !== '') {
      updatePayload.password = formData.password;
    }

    if (!user?.id) {
      toast.error('Lỗi: Không tìm thấy ID người dùng!');
      return;
    }

    setIsLoading(true);

    try {
      await updateProfile(updatePayload);

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

  const handleDeleteAccount = async () => {
    const isConfirm = window.confirm("CẢNH BÁO ĐỎ: Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản của mình không?\nToàn bộ dữ liệu sẽ bị mất và không thể khôi phục!");
    if (!isConfirm) return;

    setIsDeleting(true);
    try {
      await deleteUser(user.id);
      toast.success("Tài khoản của bạn đã được xóa vĩnh viễn.");
      onClose();
      logout(); // Xóa sạch token và user info
      navigate('/login'); // Chuyển hướng về đăng nhập
    } catch (error) {
      console.error("LỖI XÓA TÀI KHOẢN:", error);
      if (error.response) {
        toast.error(`Lỗi: ${error.response.data?.detail || 'Không thể xóa tài khoản!'}`);
      } else {
        toast.error(error.message || 'Lỗi kết nối khi xóa tài khoản!');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onMouseDown={handleOverlayMouseDown}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#FAF5EC] shadow-2xl animate-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200/50 px-6 py-4 bg-white/50">
          <h2 className="font-serif text-xl font-bold text-[#2A1610]">
            Thông tin tài khoản
          </h2>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-200/50 hover:text-stone-800 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Avatar Section */}
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#2A1610] text-xl font-bold text-white shadow-sm overflow-hidden relative">
              {formData.avatar_url ? (
                <>
                  <img 
                    src={formData.avatar_url} 
                    alt="Avatar" 
                    className="h-full w-full object-cover" 
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
                  />
                  <div style={{ display: 'none' }} className="h-full w-full items-center justify-center bg-[#2A1610] text-white">
                    {formData.username ? formData.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#2A1610] text-white">
                  {formData.username ? formData.username.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Đường dẫn ảnh đại diện (URL)
              </label>
              <input
                type="text"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-800 focus:border-[#CAA46A] focus:outline-none focus:ring-2 focus:ring-[#CAA46A]/20 transition-all"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>
          
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Tên hiển thị
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-[#CAA46A] focus:outline-none focus:ring-2 focus:ring-[#CAA46A]/20 transition-all"
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
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-[#CAA46A] focus:outline-none focus:ring-2 focus:ring-[#CAA46A]/20 transition-all"
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
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-[#CAA46A] focus:outline-none focus:ring-2 focus:ring-[#CAA46A]/20 transition-all"
              placeholder="Nhập mật khẩu mới nếu muốn đổi..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading || isDeleting}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 focus:outline-none"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || isDeleting}
              className="flex items-center gap-2 rounded-xl bg-[#2A1610] px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-[#1A0D09] focus:outline-none focus:ring-2 focus:ring-[#CAA46A] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              <span>{isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
            </button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="border-t border-red-200 bg-red-50 p-6 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-red-800 flex items-center gap-1.5">
                <AlertTriangle size={16} />
                Khu vực nguy hiểm
              </h3>
              <p className="text-xs text-red-600 mt-1">
                Khi bạn xóa tài khoản, mọi dữ liệu không thể khôi phục.
              </p>
            </div>
            
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={isDeleting || isLoading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 shadow-sm"
            >
              {isDeleting && <Loader2 size={16} className="animate-spin" />}
              {isDeleting ? 'Đang xóa...' : 'Xóa tài khoản'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
