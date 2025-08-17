import { create } from "zustand";
import { CounterIn, Food } from "..";

type ControlsStore = {
    isRepeatOn: boolean;
    isPause: boolean;
    isShuffleOn: boolean;
    currentSong: File | null;
    songDuration: number;
    setIsPause: () => void;
    setIsRepeatOn: () => void;
    setIsShuffleOn: () => void;
    setCurrentPlayingSong: (song: File) => void;
    setSongDuration: (duration: number) => void;
};
type ActiveTabStore = {
    tab: string;
    setActiveTab: (tab: string) => void;
};

export const useMusicPlayerStore = create<ControlsStore>((set) => ({
    isRepeatOn: false,
    isPause: false,
    isShuffleOn: false,
    currentSong: null,
    songDuration: 0,

    setIsPause: () => set((state) => ({ isPause: !state.isPause })),
    setIsRepeatOn: () => set((state) => ({ isRepeatOn: !state.isRepeatOn })),
    setIsShuffleOn: () => set((state) => ({ isShuffleOn: !state.isShuffleOn })),
    setCurrentPlayingSong: (song) => set(() => ({ currentSong: song })),
    setSongDuration: (songDuration) => set(() => ({ songDuration })),
}));

export const useActiveTab = create<ActiveTabStore>((set) => ({
    tab: "Home",
    setActiveTab: (tab) => set({ tab }),
}));
