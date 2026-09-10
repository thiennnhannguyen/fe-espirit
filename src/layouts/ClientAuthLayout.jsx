import { Outlet } from 'react-router-dom';
import logoDongson from '../assets/logo-dongson.jpg';

export default function ClientAuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-[#FAF5EC] font-sans">
      {/* 
        CỘT TRÁI: Hình ảnh / Branding (Chỉ hiện trên Desktop lg trở lên)
      */}
      <div className="hidden w-1/2 relative lg:flex flex-col items-center justify-center bg-[#7A1E24] overflow-hidden">
        
        {/* Họa tiết Trống Đồng mờ ở Background */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #CAA46A 2px, transparent 2px)',
            backgroundSize: '40px 40px'
          }}
        ></div>
        
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.07] pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-[800px] h-[800px] animate-[spin_120s_linear_infinite]">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#CAA46A" strokeWidth="2" strokeDasharray="10 5" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="#CAA46A" strokeWidth="1" />
            <polygon points="100,20 120,80 180,100 120,120 100,180 80,120 20,100 80,80" fill="none" stroke="#CAA46A" strokeWidth="1" />
          </svg>
        </div>

        {/* Nội dung Cột trái */}
        <div className="relative z-10 flex flex-col items-center text-center px-12">
          <div className="mb-8 h-28 w-28 overflow-hidden rounded-full shadow-2xl border border-white/20">
            <img
              src={logoDongson}
              alt="E-SPIRIT Logo"
              className="h-full w-full object-cover mix-blend-screen scale-[1.18]"
            />
          </div>
          <h1 className="font-serif text-4xl font-bold leading-tight text-white mb-4">
            E-SPIRIT
          </h1>
          <p className="font-serif text-2xl text-[#CAA46A] italic mb-6">
            "Gieo duyên lành, gặt bình an"
          </p>
          <p className="text-white/80 max-w-md leading-relaxed">
            Nền tảng kết nối tâm linh và bảo tồn các di sản tín ngưỡng truyền thống Việt Nam. Bắt đầu hành trình của bạn ngay hôm nay.
          </p>
        </div>
      </div>

      {/* 
        CỘT PHẢI: Form nhập liệu (Chứa Outlet)
      */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Logo E-SPIRIT (Chỉ hiển thị trên Mobile/Tablet vì Desktop đã có ở cột trái) */}
          <div className="mb-10 flex flex-col items-center justify-center lg:hidden">
            <div className="mb-3 h-20 w-20 overflow-hidden rounded-full bg-[#7A1E24] shadow-lg">
              <img
                src={logoDongson}
                alt="E-SPIRIT Logo"
                className="h-full w-full object-cover mix-blend-screen scale-[1.18]"
              />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#2A1610]">
              E-SPIRIT
            </h1>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
