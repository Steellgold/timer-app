import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dayJS } from "../dayjs/day-js";

export type Timer = {
  id: string;

  title?: string;
  
  position: number;
  ogPosition?: number;

  startAt: number;
  endAt: number;

  pausedAt: number;
  isPaused: boolean;
  isEnded?: boolean;

  isFocused: boolean;

  pinned: boolean;
}

type TimerStore = {
  timers: Timer[];

  createTimer: (timer: Timer) => void;
  deleteTimer: (id: string) => void;

  updatePosition: (id: string, position: number) => void;
  resetPosition: (id: string) => void;
  resetPositions: () => void;

  toggleEnd: (id: string) => void;

  togglePaused: (id: string) => void;
  togglePinned: (id: string) => void;
  toggleFocused: (id: string) => void;
}

const updateTimer = (state: TimerStore, id: string, updates: Partial<Timer>): Timer[] => {
  return state.timers.map((timer) =>
    timer.id === id ? { ...timer, ...updates } : timer
  );
};

export const useTimers = create(
  persist<TimerStore>((set) => ({
    timers: [],

    createTimer: (timer) => set((state) => ({ timers: [...state.timers, timer] })),
    deleteTimer: (id) => set((state) => ({ timers: state.timers.filter((timer) => timer.id !== id) })),

    updatePosition: (id, position) => set((state) => ({ timers: updateTimer(state, id, { position }) })),
    resetPosition: (id) => set((state) => ({ timers: updateTimer(state, id, { position: state.timers.find((timer) => timer.id === id)?.ogPosition ?? 0 }) })),
    resetPositions: () => set((state) => ({ timers: state.timers.map((timer) => ({ ...timer, position: timer.ogPosition ?? 0 })) })),

    togglePaused: (id) => set((state) => ({
      timers: updateTimer(state, id, {
        isPaused: !state.timers.find((timer) => timer.id === id)?.isPaused,
        pausedAt: dayJS().valueOf()
      }) })),
    togglePinned: (id) => set((state) => ({ timers: updateTimer(state, id, { pinned: !state.timers.find((timer) => timer.id === id)?.pinned }) })),
    toggleFocused: (id) => set((state) => ({ timers: updateTimer(state, id, { isFocused: !state.timers.find((timer) => timer.id === id)?.isFocused }) })),

    toggleEnd: (id) => set((state) => ({ timers: updateTimer(state, id, { isEnded: true }) }))
  }), { name: "timers" })
);