import ChatInput from './components/ChatInput';
import EmptyState from './components/EmptyState';
import MessageList from './components/MessageList';
import { useChatStore } from '../../../store/useChatStore';

export default function ChatHome() {
  // Kết nối với Zustand store
  const messages = useChatStore((state) => state.messages);
  const isTyping = useChatStore((state) => state.isTyping);

  return (
    <div className="flex h-full w-full flex-col relative">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col relative">
        
        <div className="flex-1 overflow-y-auto px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex h-full flex-col">
            {messages.length === 0 ? (
              <EmptyState />
            ) : (
              <MessageList messages={messages} isTyping={isTyping} />
            )}
          </div>
        </div>

        <div className="w-full shrink-0 px-4 pb-6 md:pb-8">
          <ChatInput />
        </div>

      </div>
    </div>
  );
}
