import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dayJS } from "../dayjs/day-js";
import { AudioType } from "./audio.store";

export type Timer = {
  id: string;
  title?: string;
  position: number;
  startAt: number;
  endAt: number;
  pausedAt: number;
  isPaused: boolean;
  isEnded?: boolean;
  isFocused: boolean;
  pinned: boolean;

  song: AudioType["song"];
  colorTheme: "default" | "blue" | "green" | "red" | "yellow" | "purple" | "pink" | "teal" | "cyan" | "orange" | "indigo";
}

type TimerStore = {
  timers: Timer[];
  createTimer: (timer: Timer) => void;
  deleteTimer: (id: string) => void;
  updatePosition: (id: string, dest: number, source: number) => void;
  toggleEnd: (id: string) => void;
  togglePaused: (id: string) => void;
  togglePinned: (id: string) => void;
  toggleFocused: (id: string) => void;

  toggleTheme: (id: string, theme: Timer["colorTheme"]) => void;
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
    
    updatePosition: (id: string, dest: number, source: number) => set((state) => {
      const updatedTimers = [...state.timers];
      const [movedTimer] = updatedTimers.splice(source, 1);
      updatedTimers.splice(dest, 0, movedTimer);

      const timersWithUpdatedPositions = updatedTimers.map((timer, index) => ({
        ...timer,
        position: index
      }));

      return { timers: timersWithUpdatedPositions };
    }),

    togglePaused: (id) => set((state) => {
      const timerToUpdate = state.timers.find((timer) => timer.id === id);
      if (!timerToUpdate) return state;

      const isPaused = !timerToUpdate.isPaused;
      let updatedTimers: Timer[];

      if (isPaused) {
        updatedTimers = updateTimer(state, id, {
          isPaused: true,
          pausedAt: dayJS().valueOf()
        });
      } else {
        const pausedDuration = dayJS().valueOf() - timerToUpdate.pausedAt;
        const updatedEndAt = timerToUpdate.endAt + pausedDuration;

        updatedTimers = updateTimer(state, id, {
          isPaused: false,
          pausedAt: 0,
          endAt: updatedEndAt
        });
      }

      return { timers: updatedTimers };
    }),
    

    togglePinned: (id) => set((state) => ({ timers: updateTimer(state, id, { pinned: !state.timers.find((timer) => timer.id === id)?.pinned }) })),
    toggleFocused: (id) => set((state) => ({ timers: updateTimer(state, id, { isFocused: !state.timers.find((timer) => timer.id === id)?.isFocused }) })),
    toggleEnd: (id) => set((state) => ({ timers: updateTimer(state, id, { isEnded: true }) })),

    toggleTheme: (id, theme) => set((state) => ({ timers: updateTimer(state, id, { colorTheme: theme }) }))
  }), { name: "timers" })
);
