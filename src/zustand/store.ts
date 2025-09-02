import { create } from "zustand";
import { UserMessage } from "@/types/type";

type ChatStore = {
  userMessages: UserMessage[] | null;
  setUserMessages: (message: UserMessage) => void;
};

type ActiveTabStore = {
  tab: string;
  setActiveTab: (tab: string) => void;
};

export const useChatClone = create<ChatStore>((set) => ({
  userMessages: null,
  setUserMessages: (message) =>
    set((state) => ({
      userMessages: [...(state.userMessages ?? []), message],
    })),
}));

export const useActiveTab = create<ActiveTabStore>((set) => ({
  tab: "Home",
  setActiveTab: (tab) => set({ tab }),
}));
