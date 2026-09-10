import { ScrollText, Package, Compass, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../../../store/useAuthStore';

export default function EmptyState() {
  const { user, isAuthenticated } = useAuthStore();

  const suggestions = [
    {
      id: 1,
      text: 'Bài cúng Mùng 1',
      icon: <ScrollText size={18} className="text-amber-600/70" />,
    },
    {
      id: 2,
      text: 'Combo mâm cúng Rằm',
      icon: <Package size={18} className="text-amber-600/70" />,
    },
    {
      id: 3,
      text: 'Xem ngày xuất hành',
      icon: <Compass size={18} className="text-amber-600/70" />,
    },
    {
      id: 4,
      text: 'Tra cứu sao hạn',
      icon: <Sparkles size={18} className="text-amber-600/70" />,
    },
  ];

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8">
      {/* Lời chào cá nhân hóa */}
      <div className="mb-12 max-w-2xl px-4 text-center">
        <h2 className="font-serif text-2xl leading-relaxed text-[#2A1610] md:text-3xl lg:leading-loose">
          <span className="font-bold">
            Xin chào {isAuthenticated && user?.username ? user.username : 'tín chủ'},
          </span><br />
          Hôm nay là 18/07 Âm lịch. Bạn cần mình trợ giúp gì cho các nghi lễ tâm linh hôm nay không?
        </h2>
      </div>

      {/* Prompt Chips (Grid Gợi ý nhanh) */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 px-4 md:grid-cols-2">
        {suggestions.map((item) => (
          <button
            key={item.id}
            className="group relative flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all duration-200 ease-in-out hover:border-amber-400/50 hover:bg-gray-50 hover:shadow-md focus:outline-none"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 transition-colors group-hover:bg-amber-100/50">
              {item.icon}
            </div>
            <span className="font-medium text-gray-700 transition-colors group-hover:text-gray-900">
              {item.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
