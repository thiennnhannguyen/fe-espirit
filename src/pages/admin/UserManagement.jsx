import { useState } from 'react';
import { Search, Filter, Lock, Unlock, History } from 'lucide-react';
import UserActivityModal from './UserActivityModal';

// Mock data: Danh sách người dùng
const initialUsers = [
  {
    id: 'usr_1',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    phone: '0901234567',
    status: 'active', // active | locked
    frequency: 'Thường xuyên',
    lastLogin: '2026-09-01 08:30',
    activityHistory: [
      { time: '2026-09-01 08:30', action: 'Đăng nhập hệ thống' },
      { time: '2026-08-30 14:15', action: 'Hỏi Chatbot về cách chuẩn bị mâm cúng giỗ Tổ' },
      { time: '2026-08-28 09:00', action: 'Đọc bài viết: Lễ hội Gò Đống Đa' }
    ]
  },
  {
    id: 'usr_2',
    name: 'Trần Thị Bình',
    email: 'binh.tran@email.com',
    phone: '0912345678',
    status: 'locked',
    frequency: 'Thỉnh thoảng',
    lastLogin: '2026-07-15 10:20',
    activityHistory: [
      { time: '2026-07-15 10:20', action: 'Đăng nhập hệ thống' },
      { time: '2026-07-15 10:25', action: 'Spam tin nhắn hệ thống (Bị hệ thống tự khóa)' }
    ]
  },
  {
    id: 'usr_3',
    name: 'Lê Hoàng Minh',
    email: 'minh.le@email.com',
    phone: '0987654321',
    status: 'active',
    frequency: 'Thường xuyên',
    lastLogin: '2026-08-31 20:00',
    activityHistory: [
      { time: '2026-08-31 20:00', action: 'Đăng nhập hệ thống' },
      { time: '2026-08-31 20:05', action: 'Hỏi Chatbot: Lễ Vu Lan bắt nguồn từ đâu?' },
      { time: '2026-08-31 20:30', action: 'Đọc bài viết: Nghi thức Cúng Rằm' }
    ]
  },
  {
    id: 'usr_4',
    name: 'Phạm Mai Hương',
    email: 'huong.pham@email.com',
    phone: '0933445566',
    status: 'active',
    frequency: 'Hiếm khi',
    lastLogin: '2026-05-10 16:45',
    activityHistory: [
      { time: '2026-05-10 16:45', action: 'Đăng nhập hệ thống' },
      { time: '2026-05-10 17:00', action: 'Tìm kiếm sự kiện: Đạo Mẫu' }
    ]
  }
];

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // State quản lý User Data thật
  const [users, setUsers] = useState(initialUsers);
  
  // State cho Modal Timeline
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle Status Lock/Unlock
  const toggleLockStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'locked' : 'active' } 
        : user
    ));
  };

  const openHistoryModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Logic Lọc (Real-time filtering)
  const filteredUsers = users.filter(user => {
    const matchSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter ? user.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  // Helper cho Avatar Text
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2A1610]">Quản lý người dùng</h1>
          <p className="mt-1 text-sm text-gray-500">Giám sát tài khoản và lịch sử hoạt động hệ thống.</p>
        </div>
      </div>

      {/* 2. Filter & Search Section */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 mb-4 text-[#7A1E24] font-medium text-sm">
          <Filter size={18} />
          <span>Bộ lọc & Tìm kiếm</span>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo Tên hoặc Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:border-[#CAA46A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#CAA46A]"
            />
          </div>

          {/* Dropdown Trạng thái */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-700 focus:border-[#CAA46A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#CAA46A]"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="locked">Đã khóa</option>
          </select>
        </div>
      </div>

      {/* 3. Data Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 min-w-[900px]">
            <thead className="bg-[#FAF5EC]/60 text-xs font-medium uppercase text-gray-700">
              <tr>
                <th className="px-6 py-4">STT</th>
                <th className="px-6 py-4">Họ và Tên</th>
                <th className="px-6 py-4">Email / SĐT</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Tần suất</th>
                <th className="px-6 py-4">Đăng nhập lần cuối</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                    Không tìm thấy dữ liệu phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#CAA46A]/20 text-xs font-bold text-[#7A1E24]">
                          {getInitials(user.name)}
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-900">{user.email}</span>
                        <span className="text-xs text-gray-500">{user.phone}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {user.status === 'active' ? (
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 border border-red-200">
                          Đã khóa
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">{user.frequency}</td>
                    <td className="px-6 py-4 text-gray-500">{user.lastLogin}</td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openHistoryModal(user)}
                          title="Xem chi tiết hoạt động"
                          className="rounded p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                          <History size={16} />
                        </button>
                        
                        <button 
                          onClick={() => toggleLockStatus(user.id)}
                          title={user.status === 'active' ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                          className={`rounded p-1.5 transition-colors ${
                            user.status === 'active' 
                              ? 'text-gray-400 hover:bg-red-50 hover:text-red-600' 
                              : 'text-red-600 bg-red-50 hover:bg-red-100'
                          }`}
                        >
                          {user.status === 'active' ? <Unlock size={16} /> : <Lock size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render Component Modal Lịch sử */}
      <UserActivityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
