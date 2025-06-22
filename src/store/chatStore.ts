import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  text: string;
  is_user: boolean;
  created_at: string;
}

interface ChatStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Omit<Message, 'id' | 'created_at'>) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      setMessages: (messages) => set({ messages }),
      addMessage: (messageData) => set((state) => ({
        messages: [
          ...state.messages,
          {
            ...messageData,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
          },
        ],
      })),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'chat-storage',
    }
  )
); 