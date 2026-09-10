import { useState } from 'react';
import { Search, Plus, MessageSquare, ListTree, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import QnAModal from './QnAModal';

// Mock data: Câu trả lời mẫu (Q&A)
const initialQnAs = [
  {
    id: 'qa_1',
    question: 'Mâm cúng Rằm tháng 7 gồm những gì?',
    answer: 'Mâm cúng Rằm tháng 7 thường gồm 3 mâm cơ bản: Mâm cúng Phật (nếu gia đình thờ Phật) gồm đồ chay, hoa quả; Mâm cúng gia tiên gồm mâm cơm mặn, rượu, trà, tiền vàng; Mâm cúng chúng sinh (cô hồn) đặt ngoài sân gồm cháo trắng, muối gạo, bánh kẹo, bỏng ngô và tiền vàng mỏng.'
  },
  {
    id: 'qa_2',
    question: 'Sao La Hầu là gì? Cách cúng giải hạn?',
    answer: 'Sao La Hầu là hung tinh, thường mang lại điềm không may về công danh, thị phi. Lễ cúng giải hạn thường làm vào ngày mùng 8 Âm lịch hàng tháng, dùng 9 ngọn đèn, bài vị màu vàng, xoay về hướng Bắc để khấn lễ.'
  },
  {
    id: 'qa_3',
    question: 'Bài văn khấn Mùng 1 hàng tháng',
    answer: 'Nam mô A Di Đà Phật! Con lạy chín phương Trời, mười phương Chư Phật. Kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn thần... (Liệt kê chi tiết tên thần linh, gia tiên). Hôm nay là mùng 1, tín chủ con thành tâm sắm sửa hương hoa lễ vật dâng lên, cúi xin các ngài phù hộ độ trì cho gia đạo bình an, tai qua nạn khỏi.'
  }
];

// Mock data: Kịch bản (Scenarios)
const initialScenarios = [
  {
    id: 'scn_1',
    name: 'Luồng hướng dẫn sắm lễ & Văn khấn',
    status: 'active',
    stepCount: 5,
    description: 'Tự động hỏi người dùng về dịp lễ, sau đó đề xuất mâm lễ và cung cấp bài văn khấn tương ứng.'
  },
  {
    id: 'scn_2',
    name: 'Luồng tư vấn chọn ngày giờ tốt',
    status: 'active',
    stepCount: 3,
    description: 'Xin thông tin tuổi gia chủ và mục đích (động thổ, cưới hỏi) để gợi ý ngày lành tháng tốt.'
  },
  {
    id: 'scn_3',
    name: 'Luồng giải đáp tử vi 12 con giáp năm nay',
    status: 'inactive',
    stepCount: 2,
    description: 'Chỉ cần nhập tuổi, bot sẽ trả lời khái quát về sao chiếu mệnh và vận hạn.'
  }
];

export default function ChatbotManagement() {
  const [activeTab, setActiveTab] = useState('qna'); // 'qna' | 'scenarios'
  
  // States cho Q&A
  const [qnaList, setQnaList] = useState(initialQnAs);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  
  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQnA, setEditingQnA] = useState(null);

  // States cho Scenarios
  const [scenariosList, setScenariosList] = useState(initialScenarios);

  // === LOGIC TAB 1: Q&A ===
  const filteredQnas = qnaList.filter(qa => 
    qa.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDeleteQnA = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu trả lời mẫu này? Thao tác không thể hoàn tác!')) {
      setQnaList(qnaList.filter(qa => qa.id !== id));
    }
  };

  const handleOpenAddModal = () => {
    setEditingQnA(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (qa) => {
    setEditingQnA(qa);
    setIsModalOpen(true);
  };

  const handleSaveQnA = (formData) => {
    if (editingQnA) {
      // Sửa
      setQnaList(qnaList.map(qa => 
        qa.id === editingQnA.id ? { ...qa, ...formData } : qa
      ));
    } else {
      // Thêm mới
      const newQa = {
        id: `qa_${Date.now()}`,
        ...formData
      };
      setQnaList([newQa, ...qnaList]);
    }
  };

  // === LOGIC TAB 2: SCENARIOS ===
  const toggleScenarioStatus = (id) => {
    setScenariosList(scenariosList.map(scn => 
      scn.id === id 
        ? { ...scn, status: scn.status === 'active' ? 'inactive' : 'active' } 
        : scn
    ));
  };

  return (
    <div className="space-y-6">
      {/* Top Bar & Tabs */}
      <div className="flex flex-col gap-5 border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2A1610]">Quản lý nội dung Chatbot</h1>
          <p className="mt-1 text-sm text-gray-500">Dạy Chatbot học kiến thức tâm linh, quản lý các kịch bản trả lời tự động.</p>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('qna')}
            className={`flex items-center gap-2 pb-3 font-medium transition-colors relative ${
              activeTab === 'qna' ? 'text-[#7A1E24]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageSquare size={18} />
            Câu trả lời mẫu (Q&A)
            {activeTab === 'qna' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7A1E24] rounded-t-full" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`flex items-center gap-2 pb-3 font-medium transition-colors relative ${
              activeTab === 'scenarios' ? 'text-[#7A1E24]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ListTree size={18} />
            Kịch bản (Scenarios)
            {activeTab === 'scenarios' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7A1E24] rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* === TAB 1: CÂU TRẢ LỜI MẪU === */}
      {activeTab === 'qna' && (
        <div className="space-y-4">
          {/* Search & Add */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:border-[#CAA46A] focus:outline-none focus:ring-1 focus:ring-[#CAA46A]"
              />
            </div>
            
            <button 
              onClick={handleOpenAddModal}
              className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#7A1E24] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#5A212C] focus:outline-none focus:ring-2 focus:ring-[#CAA46A] focus:ring-offset-1"
            >
              <Plus size={18} />
              Thêm câu trả lời mới
            </button>
          </div>

          {/* Q&A Accordion List */}
          <div className="space-y-3">
            {filteredQnas.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center text-gray-500">
                Không tìm thấy câu hỏi nào phù hợp.
              </div>
            ) : (
              filteredQnas.map(qa => (
                <div key={qa.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all">
                  
                  {/* Header Accordion */}
                  <div 
                    className="flex cursor-pointer items-center justify-between bg-white px-5 py-4 hover:bg-gray-50/50"
                    onClick={() => toggleExpand(qa.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#CAA46A]/10 text-[#7A1E24]">
                        <MessageSquare size={16} />
                      </div>
                      <h3 className="font-medium text-gray-900">{qa.question}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      {expandedId === qa.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </div>
                  </div>

                  {/* Body Accordion (Answer) */}
                  {expandedId === qa.id && (
                    <div className="border-t border-gray-100 bg-[#FAF5EC]/30 px-5 py-4">
                      <div>
                        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{qa.answer}</p>
                        <div className="mt-4 flex items-center gap-2 border-t border-gray-200/60 pt-3">
                          <button 
                            onClick={() => handleOpenEditModal(qa)}
                            className="flex items-center gap-1.5 rounded p-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                          >
                            <Edit2 size={14} /> Sửa nội dung
                          </button>
                          <button 
                            onClick={() => handleDeleteQnA(qa.id)}
                            className="flex items-center gap-1.5 rounded p-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} /> Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* === TAB 2: SCENARIOS === */}
      {activeTab === 'scenarios' && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {scenariosList.map(scn => (
            <div key={scn.id} className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-[#CAA46A]/50 transition-colors">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FAF5EC] text-[#7A1E24]">
                    <ListTree size={20} />
                  </div>
                  
                  {/* Toggle Switch */}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${scn.status === 'active' ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {scn.status === 'active' ? 'Đang bật' : 'Đã tắt'}
                    </span>
                    <button
                      onClick={() => toggleScenarioStatus(scn.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                        scn.status === 'active' ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          scn.status === 'active' ? 'translate-x-2' : '-translate-x-2'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                <h3 className="mt-4 font-serif text-lg font-bold text-gray-900">{scn.name}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{scn.description}</p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm font-medium text-gray-600">
                  {scn.stepCount} bước kịch bản
                </span>
                <button className="flex items-center gap-1.5 text-sm font-medium text-[#7A1E24] hover:text-[#5A212C] transition-colors">
                  <Edit2 size={14} />
                  Chỉnh sửa
                </button>
              </div>
            </div>
          ))}

          {/* Add New Scenario Card */}
          <button className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-gray-500 transition-colors hover:border-[#CAA46A] hover:bg-[#FAF5EC]/30 hover:text-[#7A1E24] min-h-[220px]">
            <Plus size={32} />
            <span className="font-medium">Tạo kịch bản mới</span>
          </button>
        </div>
      )}

      {/* Modal Thêm/Sửa Q&A */}
      <QnAModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQnA}
        initialData={editingQnA}
      />

    </div>
  );
}
