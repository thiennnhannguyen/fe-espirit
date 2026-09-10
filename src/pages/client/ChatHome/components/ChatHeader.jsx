import { useState } from 'react';
import { Menu, ChevronDown, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserDropdown from '../../../../components/client/UserDropdown';
import { useAuthStore } from '../../../../store/useAuthStore';

export default function ChatHeader({ isSidebarOpen, onToggleSidebar, onOpenFeedback, onOpenProfile }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  // Lấy trạng thái từ store
  const { user, isAuthenticated } = useAuthStore();

  // Khởi tạo chữ cái đầu của username nếu đã đăng nhập
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <header className="relative z-30 flex h-16 w-full shrink-0 items-center justify-between bg-transparent px-4 py-2">
      {/* Bên Trái: Nút Hamburger Menu */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-gray-700 shadow-sm border border-stone-200/60 transition-colors hover:bg-white hover:text-[#7A1E24] ${
            isSidebarOpen ? 'lg:hidden' : ''
          }`}
          title={isSidebarOpen ? 'Đóng menu' : 'Mở menu'}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Ở Giữa: Widget Lịch Âm Mini */}
      <div className="flex items-center">
        <div className="flex items-center gap-2 rounded-full border border-stone-200/80 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-md transition-all hover:bg-white">
          <span className="font-serif text-xs font-semibold text-[#2A1610] sm:text-sm">
            30/08/2026 (18/07 Âm) • Mùng 1
          </span>
          <span className="inline-flex items-center justify-center text-amber-600 animate-pulse">
            🔔
          </span>
        </div>
      </div>

      {/* Bên Phải: User Action Area */}
      <div className="relative flex items-center">
        {isAuthenticated ? (
          <>
            {/* User Avatar & ChevronDown mở Dropdown Menu */}
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full bg-white/80 p-1.5 pl-2 pr-3 border border-stone-200/80 shadow-sm transition-all hover:bg-white focus:outline-none"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7A1E24] text-xs font-bold text-white shadow-xs">
                {initial}
              </div>
              <span className="hidden text-xs font-semibold text-gray-700 sm:inline-block max-w-[120px] truncate">
                {user?.username || 'Người dùng'}
              </span>
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Account Dropdown Menu */}
            <UserDropdown
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
              onOpenFeedback={onOpenFeedback}
              onOpenProfile={onOpenProfile}
            />
          </>
        ) : (
          /* Nút Đăng nhập cho Khách vãng lai */
          <button
            onClick={() => navigate('/login')}
            className="rounded-full bg-[#7A1E24] px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#5A212C]"
          >
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
}
