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
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white/60 backdrop-blur-2xl p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-[28px] leading-tight font-bold text-[#2A1610]">Đăng nhập</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username Input */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-stone-700">Tên đăng nhập</label>
          <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus-within:text-[#CAA46A]">
              <User size={18} className="text-stone-400 transition-colors group-focus-within:text-[#CAA46A]" />
            </div>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full rounded-2xl border border-stone-200 bg-white/80 py-3.5 pl-11 pr-4 text-sm text-stone-800 transition-all focus:border-[#CAA46A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#CAA46A]/10 hover:border-stone-300"
              placeholder="Nhập tên đăng nhập của bạn"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-semibold text-stone-700">Mật khẩu</label>
            <Link to="/forgot-password" className="text-xs font-semibold text-[#CAA46A] transition-colors hover:text-[#2A1610]">
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Lock size={18} className="text-stone-400 transition-colors group-focus-within:text-[#CAA46A]" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-2xl border border-stone-200 bg-white/80 py-3.5 pl-11 pr-11 text-sm text-stone-800 transition-all focus:border-[#CAA46A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#CAA46A]/10 hover:border-stone-300"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 hover:text-stone-700 focus:outline-none transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#2A1610] to-[#3a221a] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2A1610]/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#2A1610]/20 disabled:translate-y-0 disabled:opacity-70 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
          {isLoading ? 'Đang xác thực...' : 'Đăng nhập'}
        </button>

        {/* Google Login */}
        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
            <span className="bg-[#FAF5EC] px-4 text-stone-400">Hoặc tiếp tục với</span>
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-stone-200 bg-white/80 py-3 text-sm font-semibold text-stone-700 shadow-sm transition-all hover:bg-white hover:text-stone-900 hover:border-stone-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-stone-100"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
          Đăng nhập bằng Google
        </button>
      </form>

      <div className="mt-8 text-center text-sm font-medium text-stone-500">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="font-bold text-[#CAA46A] transition-colors hover:text-[#2A1610]">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}
