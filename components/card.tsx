"use client";

import { Timer, useTimers } from "@/lib/stores/timers.store";
import { Component } from "./ui/component";
import { DraggableProvided } from "@hello-pangea/dnd";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useEffect, useRef, useState } from "react";
import { Bell, Pause, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { dayJS } from "@/lib/dayjs/day-js";

export const TimerCard: Component<Timer & { provided: DraggableProvided }> = ({
  provided,
  pinned,
  startAt,
  endAt,
  isPaused,
  isEnded,
  title,
  id
}) => {
  const { deleteTimer, togglePaused, toggleEnd } = useTimers()
  const audio = useRef(new Audio('/sounds/horror.mp3'));
  
  const [timeLeft, setTimeLeft] = useState<number>((dayJS(endAt).diff(dayJS(), "seconds")));
  const [pourcentage, setPourcentage] = useState<number>(0);

  useEffect(() => {
    if (timeLeft <= 0) {
      toggleEnd(id);
      audio.current.play();
    }
  }, [timeLeft, id, toggleEnd, deleteTimer]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerTimeout = setTimeout(() => {
        if (isPaused) return;
        setTimeLeft(timeLeft - 1);
        setPourcentage((timeLeft / (dayJS(endAt).diff(dayJS(startAt), "seconds")) * 100));
      }, 1000);
      return () => clearTimeout(timerTimeout);
    }
  }, [timeLeft, isPaused, endAt, startAt]);
  

  return (
    <div ref={provided.innerRef} {...provided.draggableProps} {...(pinned ? {} : provided.dragHandleProps)}
      className="bg-[#d1ccc7] dark:bg-[#131212] border border-[#201f1f1c] rounded-xl p-4 sm:w-[200px]"
    >
      <div className="relative">
        <CircularProgressbar
          value={!isEnded ? pourcentage : 0}
          styles={buildStyles({
            pathColor: '#fff',
            trailColor: 'grey',
            pathTransitionDuration: 0.5,
            strokeLinecap: 'round',
          })}
          strokeWidth={4}
        />

        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <div className="flex items-center gap-1.5">
            <Bell size={16} fill="currentColor" />
            {dayJS(endAt).format("HH:mm")}
          </div>

          {!isEnded && <div className="text-2xl font-bold">{dayJS(timeLeft * 1000).format("mm:ss")}</div>}
          {isEnded && <div className="text-2xl font-bold">00:00</div>}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <X
          fill="currentColor"
          size={30}
          className={cn(
            "cursor-pointer rounded-full p-1.5 text-primary-foreground",
            "dark:text-red-900 bg-red-100 dark:bg-red-400",
            "hover:bg-red-200 dark:hover:bg-red-300"
          )}
          onClick={() => {
            deleteTimer(id);
            audio.current.pause();
            audio.current.currentTime = 0;
          }}
        />

        {!isPaused ? (
          <Pause
            fill="currentColor"
            size={30}
            onClick={() => !isEnded && togglePaused(id)}
            className={cn(
              "cursor-pointer rounded-full p-1.5 text-primary-foreground",
              "dark:text-yellow-900 bg-yellow-100 dark:bg-yellow-400",
              "hover:bg-yellow-200 dark:hover:bg-yellow-300", {
                "opacity-50 hover:cursor-not-allowed": isEnded
              }
            )}
          />
        ) : (
          <Play
            fill="currentColor"
            size={30}
            onClick={() => !isEnded && togglePaused(id)}
            className={cn(
              "cursor-pointer rounded-full p-1.5 text-primary-foreground",
              "dark:text-green-900 bg-green-100 dark:bg-green-400",
              "hover:bg-green-200 dark:hover:bg-green-300", {
              "opacity-50 hover:cursor-not-allowed": isEnded
              }
            )}
          />
        )}
      </div>
    </div>
  )
}