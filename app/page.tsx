"use client";

import { NewTimerDrawer } from "@/components/new-timer";
import { dayJS } from "@/lib/dayjs/day-js";
import { useTimers } from "@/lib/stores/timers.store";
import { cn } from "@/lib/utils";
import { Pause, Pin, PinOff, Play, X } from "lucide-react";

export default function Home() {
  const { timers, deleteTimer, togglePaused, togglePinned } = useTimers();
  
  if (!timers.length) return (
    <div className="flex justify-center items-center h-screen flex-col space-y-1.5">
      <p className="text-primary-foreground dark:text-[#d1ccc7] text-center text-lg">
        You don&apos;t have any timers yet, create one now!
      </p>

      <NewTimerDrawer />
    </div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {timers.map((timer) => (
        <div
          key={timer.id}
          className="bg-[#d1ccc7] dark:bg-[#131212] border border-[#201f1f1c] rounded-xl p-4">

          <div className="flex justify-between flex-row-reverse">
            {!timer.pinned ? (
              <Pin
                fill="currentColor"
                size={30}
                onClick={() => timers.every((timer) => !timer.pinned) ? togglePinned(timer.id) : null}
                className={cn(
                  "cursor-pointer rounded-full p-1.5 text-primary-foreground", {
                    // If no timer is pinned, then the color is blue
                    "dark:text-blue-900 bg-blue-100 dark:bg-blue-400": timers.every((timer) => !timer.pinned), 
                    "hover:bg-blue-200 dark:hover:bg-blue-300": timers.every((timer) => !timer.pinned),

                    // If at least one timer is pinned, then the color is gray
                    "dark:text-gray-900 bg-gray-100 dark:bg-gray-400": timers.some((timer) => timer.pinned),
                    "hover:bg-gray-200 dark:hover:bg-gray-300": timers.some((timer) => timer.pinned)
                  }
                )}
              />
            ) : (
              <PinOff
                fill="currentColor" size={30}
                onClick={() => togglePinned(timer.id)}
                className={cn(
                  // If at least one timer is pinned, then the color is gray
                  "cursor-pointer rounded-full p-1.5 text-primary-foreground",
                  "dark:text-blue-900 bg-blue-100 dark:bg-blue-400",
                  "hover:bg-blue-200 dark:hover:bg-blue-300"
                )}
              />
            )}
          </div>

          <p>{timer.position}</p>
          <p>{dayJS(timer.startedAt).format("HH:mm:ss ddd, MMM D")}</p>
          <p>{dayJS(timer.endedAt).format("HH:mm:ss ddd, MMM D")}</p>

          <div className="flex justify-between">
            <X
              fill="currentColor"
              size={30}
              className={cn(
                "cursor-pointer rounded-full p-1.5 text-primary-foreground",
                "dark:text-red-900 bg-red-100 dark:bg-red-400",
                "hover:bg-red-200 dark:hover:bg-red-300"
              )}
              onClick={() => deleteTimer(timer.id)}
            />

            {timer.isPaused ? (
              <Play
                fill="currentColor"
                size={30}
                onClick={() => togglePaused(timer.id)}
                className={cn(
                  "cursor-pointer rounded-full p-1.5 text-primary-foreground",
                  "dark:text-green-900 bg-green-100 dark:bg-green-400",
                  "hover:bg-green-200 dark:hover:bg-green-300"
                )}
              />
            ) : (
              <Pause
                fill="currentColor"
                size={30}
                onClick={() => togglePaused(timer.id)}
                className={cn(
                  "cursor-pointer rounded-full p-1.5 text-primary-foreground",
                  "dark:text-yellow-900 bg-yellow-100 dark:bg-yellow-400",
                  "hover:bg-yellow-200 dark:hover:bg-yellow-300"
                )}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const Timers = () => {
  return (
    <div>
      <p>Timers</p>
      <p>Timers</p>
      <p>Timers</p>
      <p>Timers</p>
      <p>Timers</p>
      <p>Timers</p>
    </div>
  );
}