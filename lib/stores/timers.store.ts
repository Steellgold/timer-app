import { Dayjs } from "dayjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Timer = {
  id: number;
  startedAt: Dayjs;
  endedAt: Dayjs;
  endSong: "default" | string;
  backgroundImage: null | string;
  pinned: boolean;
};

type TimersStore = {
  timers: Timer[];
  createTimer: (timer: Timer) => void;
  deleteTimer: (id: number) => void;
  togglePinned: (id: number) => void;
  setEndSong: (id: number, song: "default" | string) => void;
  setBackgroundImage: (id: number, url: null | string) => void;
};

const updateTimer = (
  state: TimersStore, 
  id: number, 
  updates: Partial<Timer>
): Timer[] => {
  return state.timers.map((timer) => 
    (timer.id === id ? { ...timer, ...updates } : timer)
  );
};

export const useTimers = create(persist<TimersStore>(
  (set) => ({
    timers: [],
    
    createTimer: (timer) => 
      set((state) => ({ timers: [...state.timers, timer] })),
    
    deleteTimer: (id) => 
      set((state) => ({ timers: state.timers.filter((timer) => timer.id !== id) })),
    
    togglePinned: (id) => 
      set((state) => ({ 
        timers: updateTimer(state, id, { pinned: !state.timers.find((timer) => timer.id === id)?.pinned })
      })),
    
    setEndSong: (id, song) => 
      set((state) => ({ 
        timers: updateTimer(state, id, { endSong: song }) 
      })),
    
    setBackgroundImage: (id, url) => 
      set((state) => ({ 
        timers: updateTimer(state, id, { backgroundImage: url }) 
      })),
  }),
  { name: "timers" }
));
