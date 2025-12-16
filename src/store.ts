import { create } from "zustand";

type UserStore = {
    username: string;
    setUsername: (name: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    username: '',
    setUsername: (name: string) => set({ username: name }),
}));