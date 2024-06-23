import { create } from "zustand";
import { persist } from "zustand/middleware";

type LocalTimeStore = {
  format: 24 | 12;
  setFormat: (format: 24 | 12) => void;

  showSeconds: boolean;
  toggleSeconds: () => void;
};


export const useLocalTime = create(persist<LocalTimeStore>((set) => ({
  format: 24,
  setFormat: (format) => set({ format }),

  showSeconds: true,
  toggleSeconds: () => set((state) => ({ showSeconds: !state.showSeconds })),
}), { name: "local-time" }));