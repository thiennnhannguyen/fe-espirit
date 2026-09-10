import { useState } from 'react';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginAction = useAuthStore((state) => state.login);
  
  const [formData, setFormData] = useState({
    username: '', // Đổi từ email sang username để đúng với yêu cầu Backend
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Lấy đường dẫn gốc mà user muốn vào
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Gọi API đăng nhập thực tế
      const data = await authService.loginUser({
        username: formData.username,
        password: formData.password
      });

      const token = data.access_token || data.token;
      let userPayload = data.user;

      // Nếu Backend chỉ trả về token mà không có user info, gọi thêm API lấy /me
      if (!userPayload && token) {
        try {
          userPayload = await authService.getCurrentUser(token);
        } catch (meError) {
          console.warn("Could not fetch user /me. Using fallback.", meError);
          userPayload = { 
            username: formData.username, 
            role: 'user' 
          };
        }
      } else if (!userPayload) {
        // Fallback hoàn toàn nếu không có cả token và user
        userPayload = { 
          username: formData.username, 
          role: 'user' 
        };
      }

      // Lưu state vào Zustand & LocalStorage
      loginAction(userPayload, token);
      
      toast.success('Đăng nhập thành công!');
      
      // Phân luồng điều hướng dựa trên role
      if (userPayload.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login Error:", error.response); // Phải log ra để debug
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || "Sai thông tin đăng nhập hoặc lỗi máy chủ!";
      toast.error(typeof errorMsg === 'string' ? errorMsg : "Đăng nhập thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center lg:text-left">
        <h2 className="font-serif text-3xl font-bold text-[#2A1610]">Hoan hỉ chào đón bạn</h2>
        <p className="mt-2 text-sm text-gray-500">
          Đăng nhập để tiếp tục hành trình tâm linh cùng E-SPIRIT.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username Input */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Tên đăng nhập (Username)</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-800 transition-all focus:border-[#CAA46A] focus:outline-none focus:ring-2 focus:ring-[#CAA46A]/20"
              placeholder="Nhập tên đăng nhập của bạn"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Mật khẩu</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-11 text-sm text-gray-800 transition-all focus:border-[#CAA46A] focus:outline-none focus:ring-2 focus:ring-[#CAA46A]/20"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-[#CAA46A] transition-colors hover:text-[#7A1E24]">
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-xl bg-[#7A1E24] py-3 text-sm font-bold text-white shadow-lg shadow-[#7A1E24]/20 transition-all hover:bg-[#5A212C] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#7A1E24] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
          {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>

        {/* Google Login */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-[#FAF5EC] px-4 text-gray-500">Hoặc tiếp tục với</span>
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Đăng nhập bằng Google
        </button>

        {/* Redirect Link */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-bold text-[#7A1E24] transition-colors hover:text-[#5A212C]">
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </div>
  );
}
