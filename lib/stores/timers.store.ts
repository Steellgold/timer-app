import { Dayjs } from "dayjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dayJS } from "../dayjs/day-js";

export type Timer = {
  id: string;
  name: string;

  position: number;
  originalPosition?: number;

  elapsed: number;

  startedAt: Dayjs;
  endedAt: Dayjs;

  isPaused: boolean;
  isEnded: boolean;
  isFocused: boolean;

  endSong: "default" | string;
  backgroundImage: null | string;
  
  pinned: boolean;
};

type TimersStore = {
  timers: Timer[];
  
  createTimer: (timer: Timer) => void;
  deleteTimer: (id: string) => void;

  addElapsed: (id: string, elapsed: number) => void;

  togglePaused: (id: string) => void;
  togglePinned: (id: string) => void;

  toggleFocused: (id: string) => void;
  removeFocusMode: () => void;
  
  setEndSong: (id: string, song: "default" | string) => void;
  setBackgroundImage: (id: string, url: null | string) => void;

  checkElapseds: () => void;

  updatePosition: (id: string, position: number) => void;
  setOriginalPosition: (id: string, position: number) => void;

  endTimer: (id: string) => void;
};

const updateTimer = (
  state: TimersStore, 
  id: string, 
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

    addElapsed: (id, elapsed) =>
      set((state) => ({ 
        timers: updateTimer(state, id, { elapsed: (state.timers.find((timer) => timer.id === id)?.elapsed ?? 0) + elapsed })
      })),

    togglePaused: (id) =>
      set((state) => ({ 
        timers: updateTimer(state, id, { isPaused: !state.timers.find((timer) => timer.id === id)?.isPaused })
      })),
    
    togglePinned: (id) => 
      set((state) => ({ 
        timers: updateTimer(state, id, { pinned: !state.timers.find((timer) => timer.id === id)?.pinned })
      })),

    toggleFocused: (id) =>
      set((state) => ({ 
        timers: updateTimer(state, id, { isFocused: !state.timers.find((timer) => timer.id === id)?.isFocused })
      })),
   
    removeFocusMode: () =>
      set((state) => {
        const focusedTimer = state.timers.find(timer => timer.isFocused);
        if (focusedTimer) {
          return {
            timers: updateTimer(state, focusedTimer.id, { isFocused: false })
          };
        }
        
        return { timers: state.timers };
      }),

    setEndSong: (id, song) => 
      set((state) => ({ 
        timers: updateTimer(state, id, { endSong: song }) 
      })),
    
    setBackgroundImage: (id, url) => 
      set((state) => ({ 
        timers: updateTimer(state, id, { backgroundImage: url }) 
      })),

    checkElapseds: () =>
      set((state) => ({
        timers: state.timers.map((timer) => {
          if (timer.isPaused) return timer;
          const elapsed = dayJS().diff(timer.startedAt, "seconds");
          const isEnded = elapsed >= timer.elapsed;
          return { ...timer, elapsed, isEnded };
        })
      })),

      updatePosition: (id, newPosition) =>
        set((state) => {
          const timerToMove = state.timers.find(timer => timer.id === id);
          if (!timerToMove) return { timers: state.timers };
      
          let updatedTimers = state.timers.filter(timer => timer.id !== id);
      
          if (timerToMove.position < newPosition) {
            updatedTimers = updatedTimers.map(timer => {
              if (timer.position > timerToMove.position && timer.position <= newPosition) {
                return { ...timer, position: timer.position - 1 };
              }
              return timer;
            });
          } else {
            updatedTimers = updatedTimers.map(timer => {
              if (timer.position < timerToMove.position && timer.position >= newPosition) {
                return { ...timer, position: timer.position + 1 };
              }
              return timer;
            });
          }
      
          timerToMove.position = newPosition;
          updatedTimers.splice(newPosition, 0, timerToMove);
      
          return { timers: updatedTimers };
        }),
        setOriginalPosition: (id, position) =>
          set((state) => ({
            timers: updateTimer(state, id, { originalPosition: position })
          })
        ),
        endTimer: (id) =>
          set((state) => ({
            timers: updateTimer(state, id, { isEnded: true })
          })
        )
  }),
  { name: "timers" }
));
