import { create } from 'zustand';
import { initialChatMessages } from '../data/mockData';
import { createSession, fetchSessions } from '../services/chatService';
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
  // State khởi tạo
  messages: initialChatMessages,
  isTyping: false,
  
  // State quản lý danh sách cuộc hội thoại
  chatSessions: [],
  currentSessionId: null,

  // Action: Thêm một tin nhắn mới
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  // Action: Cập nhật trạng thái typing của Bot
  setTyping: (status) => set({ isTyping: status }),

  // Action: Lưu lại session hiện tại vào danh sách (Lưu nội bộ Frontend)
  saveCurrentSession: () => {
    const { messages, currentSessionId, chatSessions } = get();
    if (messages.length === 0) return;

    // Lấy tin nhắn đầu tiên của user để làm title
    const firstUserMsg = messages.find((m) => m.sender === 'user')?.content || 'Cuộc trò chuyện mới';
    const title = firstUserMsg.length > 20 ? firstUserMsg.substring(0, 20) + '...' : firstUserMsg;

    if (currentSessionId) {
      // Cập nhật session hiện tại
      set({
        chatSessions: chatSessions.map((session) =>
          session.id === currentSessionId
            ? { ...session, title, messages: [...messages] }
            : session
        ),
      });
    } else {
      // Nếu chưa có currentSessionId (ví dụ trước khi có API tạo session)
      const newSession = {
        id: Date.now().toString(),
        title,
        isPinned: false,
        messages: [...messages],
      };
      set({ chatSessions: [newSession, ...chatSessions], currentSessionId: newSession.id });
    }
  },

  // Action: Tạo phiên trò chuyện mới qua API
  createNewChat: async () => {
    // Lưu lại session hiện tại trước khi tạo mới
    get().saveCurrentSession();
    
    try {
      const newSessionData = await createSession("Phiên trò chuyện mới");
      
      const newSession = {
        id: newSessionData.id,
        title: newSessionData.title || "Phiên trò chuyện mới",
        isPinned: false,
        messages: [],
      };

      set((state) => ({
        chatSessions: [newSession, ...state.chatSessions],
        currentSessionId: newSession.id,
        messages: [], // Trả về Empty State
      }));
      
    } catch (error) {
      console.error("Lỗi khi tạo phiên mới:", error);
      toast.error("Không thể tạo đoạn chat mới lúc này!");
      throw error;
    }
  },

  // Action: Tải lại một session cũ vào màn hình chat
  loadSession: (sessionId) => {
    const { currentSessionId, chatSessions, saveCurrentSession } = get();
    if (currentSessionId === sessionId) return;

    saveCurrentSession();
    
    const sessionToLoad = chatSessions.find((s) => s.id === sessionId);
    if (sessionToLoad) {
      set({ messages: [...sessionToLoad.messages], currentSessionId: sessionId });
    }
  },

  // Action: Lấy danh sách session từ API
  fetchSessionsAction: async () => {
    try {
      const data = await fetchSessions();
      if (data && data.length > 0) {
        // Ánh xạ data từ API vào state chatSessions nếu có
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch sử chat:", error);
    }
  },

  // Action: Gắn cờ / Bỏ gắn cờ ghim cho session
  togglePinSession: (sessionId) => {
    set((state) => ({
      chatSessions: state.chatSessions.map((s) =>
        s.id === sessionId ? { ...s, isPinned: !s.isPinned } : s
      ),
    }));
  },

  // Action: Đổi tên session
  renameSession: (sessionId, newTitle) => {
    set((state) => ({
      chatSessions: state.chatSessions.map((s) =>
        s.id === sessionId ? { ...s, title: newTitle } : s
      ),
    }));
  },

  // Action: Giả lập Bot phản hồi
  simulateBotResponse: () => {
    set({ isTyping: true });
    
    setTimeout(() => {
      set((state) => ({
        isTyping: false,
        messages: [
          ...state.messages,
          {
            sender: 'bot',
            type: 'text',
            content: 'Đây là câu trả lời mẫu từ E-SPIRIT cho câu hỏi của bạn. Tính năng AI thực tế sẽ được tích hợp ở các bước sau.',
          }
        ]
      }));
    }, 1500);
  }
}));
