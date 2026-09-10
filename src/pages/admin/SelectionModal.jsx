import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export default function SelectionModal({ isOpen, onClose, onConfirm, type, existingItems }) {
  // Kho dữ liệu Mock (Dùng để chọn)
  const mockArticles = [
    { id: 'art_10', title: 'Ý nghĩa mâm cúng ngày Rằm tháng 7', category: 'Nghi thức', date: '2026-08-15' },
    { id: 'art_11', title: 'Cách đi lễ Chùa đúng chuẩn', category: 'Văn hoá', date: '2026-08-10' },
    { id: 'art_12', title: 'Tử vi 12 con giáp tháng 8 Âm Lịch', category: 'Tử vi', date: '2026-08-01' },
    { id: 'art_13', title: 'Nghi lễ Đạo Mẫu và những điều cần biết', category: 'Tôn giáo', date: '2026-07-20' },
    { id: 'art_14', title: 'Hướng dẫn chuẩn bị mâm cúng cô hồn', category: 'Nghi thức', date: '2026-08-25' },
  ];

  const mockProducts = [
    { id: 'prod_10', name: 'Combo mâm cúng gia tiên', price: '450.000đ' },
    { id: 'prod_11', name: 'Giỏ hoa quả cúng dường', price: '250.000đ' },
    { id: 'prod_12', name: 'Bộ vàng mã Vu Lan', price: '120.000đ' },
    { id: 'prod_13', name: 'Nhang nụ trầm hương', price: '300.000đ' },
    { id: 'prod_14', name: 'Đèn dầu lưu ly', price: '180.000đ' },
  ];

  const [availableItems, setAvailableItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const allItems = type === 'article' ? mockArticles : mockProducts;
      // Lọc bỏ những item đã có sẵn trong danh sách hiện tại
      const existingIds = existingItems.map(item => item.id);
      setAvailableItems(allItems.filter(item => !existingIds.includes(item.id)));
      setSelectedIds([]); // Reset lựa chọn mỗi khi mở modal
    }
  }, [isOpen, type, existingItems]);

  if (!isOpen) return null;

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleConfirm = () => {
    const selectedItems = availableItems.filter(item => selectedIds.includes(item.id));
    onConfirm(selectedItems);
    onClose();
  };

  const title = type === 'article' ? 'Chọn bài viết nổi bật' : 'Thêm hàng hóa / Mâm lễ đề xuất';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-[#FAF5EC]">
          <h3 className="font-serif text-lg font-bold text-[#2A1610]">{title}</h3>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-white hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 flex-1">
          {availableItems.length === 0 ? (
            <p className="text-center text-gray-500 italic py-8">Tất cả các mục đã được thêm vào trang chủ.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {availableItems.map(item => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <div 
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all flex items-start gap-3 ${
                      isSelected 
                        ? 'border-[#CAA46A] bg-[#FAF5EC]/50 shadow-sm' 
                        : 'border-gray-200 hover:border-[#CAA46A]/50 bg-white'
                    }`}
                  >
                    {/* Checkbox Icon */}
                    <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      isSelected ? 'border-[#CAA46A] bg-[#CAA46A] text-white' : 'border-gray-300'
                    }`}>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                    
                    {/* Item Content */}
                    <div>
                      <h4 className="font-medium text-gray-900 line-clamp-2">
                        {type === 'article' ? item.title : item.name}
                      </h4>
                      <p className="mt-1 text-xs text-gray-500">
                        {type === 'article' ? `${item.category} • ${item.date}` : `Giá: ${item.price}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">
            Đã chọn: <span className="text-[#7A1E24]">{selectedIds.length}</span> mục
          </span>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="rounded-lg bg-white px-5 py-2 text-sm font-medium text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button 
              onClick={handleConfirm}
              disabled={selectedIds.length === 0}
              className={`rounded-lg px-5 py-2 text-sm font-medium shadow-sm transition-colors ${
                selectedIds.length > 0 
                  ? 'bg-[#7A1E24] text-white hover:bg-[#5A212C]' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Xác nhận
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
