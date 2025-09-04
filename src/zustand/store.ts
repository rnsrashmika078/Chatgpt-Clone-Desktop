import { create } from "zustand";
import { AuthUser, UserMessage } from "@/types/type";

type ChatStore = {
  height: number;
  loading: boolean;
  authUser: AuthUser | null;
  userMessages: UserMessage[] | null;
  notifier: String | null;
  setUserMessages: (message: UserMessage) => void;
  setLoading: (isLoading: boolean) => void;
  setHeight: (currentHeight: number) => void;
  setNotification: (notifier: string | null) => void;
  setUpdateMessage: (id: string, message: string) => void;
  setAuthUser: (authData: AuthUser) => void;
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
  height: window.innerHeight,
  setUserMessages: (message) =>
    set((state) => ({
      userMessages: [...(state.userMessages ?? []), message],
    })),
  setHeight: (currentHeight) => set(() => ({ height: currentHeight })),
  setNotification: (notifier) => set(() => ({ notifier })),
  setLoading: (isLoading) => set(() => ({ loading: isLoading })),
  setAuthUser: (authData) => set(() => ({ authUser: authData })),
  setUpdateMessage: (id, message) =>
    set((state) => ({
      userMessages: state.userMessages?.map((msg) =>
        msg.id === id ? { ...msg, message } : msg
      ),
    })),
}));

export const useActiveTab = create<ActiveTabStore>((set) => ({
  tab: "Home",
  setActiveTab: (tab) => set({ tab }),
}));
