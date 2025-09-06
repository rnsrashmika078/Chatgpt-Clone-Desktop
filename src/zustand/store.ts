import { create } from "zustand";
import { AuthUser, UpdateChat, UserMessage } from "@/types/type";

type ChatStore = {
  height: number;
  loading: boolean;
  chats: UpdateChat[] | null;
  authUser: AuthUser | null;
  userMessages: UserMessage[] | null;
  notifier: String | null;
  activeChat: UpdateChat | null;
  setUserMessages: (message: UserMessage | null) => void;
  setLoading: (isLoading: boolean) => void;
  setHeight: (currentHeight: number) => void;
  setNotification: (notifier: string | null) => void;
  setUpdateMessage: (id: string, message: string) => void;
  setAuthUser: (authData: AuthUser) => void;
  setChats: (chat: UpdateChat) => void;
  setAllmessage: (messages: UserMessage[]) => void;
  updateChats: (mutateChats: UpdateChat[]) => void;
  setActiveChat: (chatData: UpdateChat | null) => void;
};

type ActiveTabStore = {
  tab: string;
  setActiveTab: (tab: string) => void;
};

export const useChatClone = create<ChatStore>((set) => ({
  userMessages: null,
  notifier: null,
  authUser: null,
  loading: false,
  chats: null,
  activeChat: null,
  height: window.innerHeight,
  setUserMessages: (message: UserMessage | null) =>
    set((state) => ({
      userMessages: message ? [...(state.userMessages ?? []), message] : [],
    })),

  setHeight: (currentHeight) => set(() => ({ height: currentHeight })),
  setNotification: (notifier) => set(() => ({ notifier })),
  setLoading: (isLoading) => set(() => ({ loading: isLoading })),
  setAuthUser: (authData) => set(() => ({ authUser: authData })),
  setChats: (chats) =>
    set((state) => ({ chats: [...(state.chats ?? []), chats] })),
  setActiveChat: (chatData) => set(() => ({ activeChat: chatData })),
  setUpdateMessage: (id, message) =>
    set((state) => ({
      userMessages: state.userMessages?.map((msg) =>
        msg.chatId === id ? { ...msg, ai: message } : msg
      ),
    })),
  setAllmessage: (messages) => set(() => ({ userMessages: messages })),
  updateChats: (mutateChats) => set(() => ({ chats: mutateChats })),
}));

export const useActiveTab = create<ActiveTabStore>((set) => ({
  tab: "Home",
  setActiveTab: (tab) => set({ tab }),
}));
