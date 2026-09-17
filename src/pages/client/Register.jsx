import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!username || !email || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    setIsLoading(true);
    
    try {
      const payload = {
        username: username,
        email: email,
        password: password
      };
      await authService.register(payload);
      
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login'); // Chuyển hướng sang trang đăng nhập
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Đăng ký thất bại. Vui lòng thử lại sau.';
      // Xử lý trường hợp detail là mảng các object (thường thấy trong FastAPI/Pydantic validation)
      if (Array.isArray(errorMsg)) {
        toast.error(errorMsg[0]?.msg || 'Dữ liệu không hợp lệ!');
      } else if (typeof errorMsg === 'string') {
        toast.error(errorMsg);
      } else {
        toast.error('Đăng ký thất bại!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white/60 backdrop-blur-2xl p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-[28px] leading-tight font-bold text-[#2A1610]">Đăng ký</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username Input */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-stone-700">Tên người dùng</label>
          <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus-within:text-[#CAA46A]">
              <User size={18} className="text-stone-400 transition-colors group-focus-within:text-[#CAA46A]" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-white/80 py-3.5 pl-11 pr-4 text-sm text-stone-800 transition-all focus:border-[#CAA46A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#CAA46A]/10 hover:border-stone-300"
              placeholder="VD: NguyenVanA"
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-stone-700">Email hoặc Số điện thoại</label>
          <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus-within:text-[#CAA46A]">
              <Mail size={18} className="text-stone-400 transition-colors group-focus-within:text-[#CAA46A]" />
            </div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-white/80 py-3.5 pl-11 pr-4 text-sm text-stone-800 transition-all focus:border-[#CAA46A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#CAA46A]/10 hover:border-stone-300"
              placeholder="Nhập email của bạn"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-stone-700">Mật khẩu</label>
          <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus-within:text-[#CAA46A]">
              <Lock size={18} className="text-stone-400 transition-colors group-focus-within:text-[#CAA46A]" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-white/80 py-3.5 pl-11 pr-11 text-sm text-stone-800 transition-all focus:border-[#CAA46A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#CAA46A]/10 hover:border-stone-300"
              placeholder="Tối thiểu 6 ký tự"
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

        {/* Confirm Password Input */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-stone-700">Xác nhận mật khẩu</label>
          <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus-within:text-[#CAA46A]">
              <Lock size={18} className="text-stone-400 transition-colors group-focus-within:text-[#CAA46A]" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full rounded-2xl border ${confirmPassword && password !== confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-stone-200 focus:border-[#CAA46A] focus:ring-[#CAA46A]/10 hover:border-stone-300'} bg-white/80 py-3.5 pl-11 pr-11 text-sm text-stone-800 transition-all focus:bg-white focus:outline-none focus:ring-4`}
              placeholder="Nhập lại mật khẩu"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 hover:text-stone-700 focus:outline-none transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="mt-1.5 text-xs font-medium text-red-500">Mật khẩu xác nhận không khớp.</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#2A1610] to-[#3a221a] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2A1610]/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#2A1610]/20 disabled:translate-y-0 disabled:opacity-70 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
          {isLoading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm font-medium text-stone-500">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-bold text-[#CAA46A] transition-colors hover:text-[#2A1610]">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}
