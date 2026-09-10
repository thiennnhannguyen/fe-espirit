import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    setIsLoading(true);
    
    try {
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
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
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center lg:text-left">
        <h2 className="font-serif text-3xl font-bold text-[#2A1610]">Khởi tạo hành trình</h2>
        <p className="mt-2 text-sm text-gray-500">
          Tạo tài khoản để lưu trữ văn khấn và nhắc nhở ngày lễ.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username Input */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Tên người dùng</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-800 transition-all focus:border-[#CAA46A] focus:outline-none focus:ring-2 focus:ring-[#CAA46A]/20"
              placeholder="VD: NguyenVanA"
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Email hoặc Số điện thoại</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-800 transition-all focus:border-[#CAA46A] focus:outline-none focus:ring-2 focus:ring-[#CAA46A]/20"
              placeholder="Nhập email của bạn"
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
              placeholder="Tối thiểu 6 ký tự"
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

        {/* Confirm Password Input */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={`w-full rounded-xl border ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-[#CAA46A] focus:ring-[#CAA46A]/20'} bg-white py-3 pl-11 pr-11 text-sm text-gray-800 transition-all focus:outline-none focus:ring-2`}
              placeholder="Nhập lại mật khẩu"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">Mật khẩu xác nhận không khớp.</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#7A1E24] py-3 text-sm font-bold text-white shadow-lg shadow-[#7A1E24]/20 transition-all hover:bg-[#5A212C] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#7A1E24] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
          {isLoading ? 'Đang khởi tạo...' : 'Đăng ký tài khoản'}
        </button>

        {/* Redirect Link */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-[#7A1E24] transition-colors hover:text-[#5A212C]">
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  );
}
