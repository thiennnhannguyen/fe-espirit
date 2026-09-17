import { Outlet } from 'react-router-dom';
import logoDongson from '../assets/logo-dongson.jpg';

export default function ClientAuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-[#FAF5EC] font-sans">
      {/* 
        CỘT TRÁI: Hình ảnh / Branding (Chỉ hiện trên Desktop lg trở lên)
      */}
      <div className="hidden w-1/2 relative lg:flex flex-col items-center justify-center bg-[#2A1610] overflow-hidden">
        
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
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Nền Gradient mờ (Blobs) tăng chiều sâu */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#CAA46A]/20 to-transparent rounded-full blur-[80px] pointer-events-none animate-pulse opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-[#2A1610]/10 to-transparent rounded-full blur-[80px] pointer-events-none opacity-60"></div>

        <div className="w-full max-w-[420px] relative z-10">
          {/* Logo E-SPIRIT (Chỉ hiển thị trên Mobile/Tablet vì Desktop đã có ở cột trái) */}
          <div className="mb-10 flex flex-col items-center justify-center lg:hidden animate-in zoom-in duration-500">
            <div className="mb-4 h-24 w-24 overflow-hidden rounded-full shadow-[0_0_40px_rgba(42,22,16,0.15)] ring-4 ring-white/50">
              <img
                src={logoDongson}
                alt="E-SPIRIT Logo"
                className="h-full w-full object-cover scale-[1.05]"
              />
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#2A1610]">
              E-SPIRIT
            </h1>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
