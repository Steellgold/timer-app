"use client";

import { Timer, useTimers } from "@/lib/stores/timers.store";
import { Component } from "./ui/component";
import { DraggableProvided } from "@hello-pangea/dnd";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useEffect, useState } from "react";
import { Bell, PaintBucket, Pause, Pin, PinOff, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { dayJS } from "@/lib/dayjs/day-js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ClassValue } from "clsx";
import useAudioStore from "@/lib/stores/audio.store";

export const TimerCard: Component<Timer & {
  provided: DraggableProvided
}> = ({
  provided,
  pinned,
  startAt,
  endAt,
  isPaused,
  isEnded,
  title,
  id,
  song,
  colorTheme
}) => {
  const { timers, deleteTimer, togglePaused, toggleEnd, togglePinned, toggleTheme } = useTimers()
  const { toggleStop, togglePlay } = useAudioStore();
  
  const [timeLeft, setTimeLeft] = useState<number>((dayJS(endAt).diff(dayJS(), "seconds")));
  const [pourcentage, setPourcentage] = useState<number>((timeLeft / (dayJS(endAt).diff(dayJS(startAt), "seconds")) * 100));

  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Awesome! You will now receive notifications');
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Awesome! You will now receive notifications');
          }
        });
      }
    }
  }, []);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      toggleEnd(id);
      togglePlay(song);

      if (Notification.permission === 'granted') {
        new Notification('Timer terminé', {
          body: 'Votre timer est terminé, vous pouvez en créer un nouveau !',
          icon: '/favicon.ico'
        });
      };
    }
  }, [timeLeft, id, toggleEnd, deleteTimer, togglePlay, song]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerTimeout = setTimeout(() => {
        if (isPaused) return;
        setTimeLeft(prevTimeLeft => {
          const newTimeLeft = prevTimeLeft - 1;
          setPourcentage((newTimeLeft / (dayJS(endAt).diff(dayJS(startAt), "seconds"))) * 100);
          return newTimeLeft;
        });
      }, 1000);
      return () => clearTimeout(timerTimeout);
    }
  }, [timeLeft, isPaused, endAt, startAt]);
  
  const formatRemainingTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? `${hours.toString().padStart(2, '0')}:` : ''}${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger>
          <div ref={provided.innerRef} {...provided.draggableProps} {...(pinned ? {} : provided.dragHandleProps)}
            className={cn("bg-[#d1ccc7] dark:bg-[#131212] border border-[#201f1f1c] rounded-xl p-4 w-auto sm:w-auto sm:h-auto", {
              "border-blue-400 dark:border-[#5363bb] bg-blue-50 dark:bg-[#5d72eb]": colorTheme === "blue",
              "border-green-400 dark:border-[#3bbf4a] bg-green-50 dark:bg-[#3bbf4a]": colorTheme === "green",
              "border-red-400 dark:border-[#bf3b3b] bg-red-50 dark:bg-[#bf3b3b]": colorTheme === "red",
              "border-yellow-400 dark:border-[#bfbe3b] bg-yellow-50 dark:bg-[#bfbe3b]": colorTheme === "yellow",
              "border-purple-400 dark:border-[#8e3bbf] bg-purple-50 dark:bg-[#8e3bbf]": colorTheme === "purple",
              "border-pink-400 dark:border-[#bf3b8e] bg-pink-50 dark:bg-[#bf3b8e]": colorTheme === "pink",
              "border-teal-400 dark:border-[#3bbfbf] bg-teal-50 dark:bg-[#3bbfbf]": colorTheme === "teal",
              "border-orange-400 dark:border-[#bf8e3b] bg-orange-50 dark:bg-[#bf8e3b]": colorTheme === "orange",
              "border-indigo-400 dark:border-[#3b3bbf] bg-indigo-50 dark:bg-[#3b3bbf]": colorTheme === "indigo"
            })}
          >
            <div className="flex justify-between items-center mb-2">
              {pinned ? (
                <PinOff fill="currentColor" size={30} className={colorScheme(colorTheme, "cursor-pointer rounded-full p-1.5 text-primary-foreground", { "opacity-50 hover:cursor-not-allowed": isEnded })} />
              ) : (timers.some(timer => timer.pinned) ? (
                <PinOff fill="currentColor" size={30} className={colorScheme(colorTheme, "cursor-pointer rounded-full p-1.5 text-primary-foreground", { "opacity-50 hover:cursor-not-allowed": isEnded })} />
              ) :
                <Pin size={30} fill="currentColor" onClick={() => !isEnded && togglePinned(id)}
                  className={colorScheme(colorTheme, "cursor-pointer rounded-full p-1.5 text-primary-foreground", { "opacity-50 hover:cursor-not-allowed": isEnded })} />
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <PaintBucket fill="currentColor" size={30}
                    className={colorScheme(colorTheme, "cursor-pointer rounded-full p-1.5 text-primary-foreground", { "opacity-50 hover:cursor-not-allowed": isEnded })} />
                </PopoverTrigger>

                <PopoverContent className="p-4 space-y-2 ml-4">
                  <div className="flex items-center space-x-2 w-full">
                    <div className={cn("h-8 w-8 cursor-pointer rounded-full dark:bg-[#131212] bg-[#d1ccc7] border-[2px]", {
                      "dark:border-[#201f1f1c] border-[#201f1f1c]": colorTheme === "default"
                    })} onClick={() => toggleTheme(id, "default")} />

                    <div className={cn("h-8 w-8 cursor-pointer rounded-full dark:bg-blue-400 bg-blue-100 border-[2px]", {
                      "dark:border-blue-400 border-blue-100": colorTheme === "blue"
                      })} onClick={() => toggleTheme(id, "blue")} />

                    <div className={cn("h-8 w-8 cursor-pointer rounded-full dark:bg-green-400 bg-green-100 border-[2px]", {
                      "dark:border-green-400 border-green-100": colorTheme === "green"
                    })} onClick={() => toggleTheme(id, "green")} />

                    <div className={cn("h-8 w-8 cursor-pointer rounded-full dark:bg-red-400 bg-red-100 border-[2px]", {
                      "dark:border-red-400 border-red-100": colorTheme === "red"
                    })} onClick={() => toggleTheme(id, "red")} />

                    <div className={cn("h-8 w-8 cursor-pointer rounded-full dark:bg-yellow-400 bg-yellow-100 border-[2px]", {
                      "dark:border-yellow-400 border-yellow-100": colorTheme === "yellow"
                    })} onClick={() => toggleTheme(id, "yellow")} />

                    <div className={cn("h-8 w-8 cursor-pointer rounded-full dark:bg-purple-400 bg-purple-100 border-[2px]", {
                      "dark:border-purple-400 border-purple-100": colorTheme === "purple"
                    })} onClick={() => toggleTheme(id, "purple")} />

                    <div className={cn("h-8 w-8 cursor-pointer rounded-full dark:bg-pink-400 bg-pink-100 border-[2px]", {
                      "dark:border-pink-400 border-pink-100": colorTheme === "pink"
                    })} onClick={() => toggleTheme(id, "pink")} />

                    <div className={cn("h-8 w-8 cursor-pointer rounded-full dark:bg-teal-400 bg-teal-100 border-[2px]", {
                      "dark:border-teal-400 border-teal-100": colorTheme === "teal"
                    })} onClick={() => toggleTheme(id, "teal")} />

                    <div className={cn("h-8 w-8 cursor-pointer rounded-full dark:bg-orange-400 bg-orange-100 border-[2px]", {
                      "dark:border-orange-400 border-orange-100": colorTheme === "orange"
                    })} onClick={() => toggleTheme(id, "orange")} />

                    <div className={cn("h-8 w-8 cursor-pointer rounded-full dark:bg-indigo-400 bg-indigo-100 border-[2px]", {
                      "dark:border-indigo-400 border-indigo-100": colorTheme === "indigo"
                    })} onClick={() => toggleTheme(id, "indigo")} />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="relative flex justify-center items-center">
              <CircularProgressbar
                value={!isEnded ? pourcentage : 0}
                styles={buildStyles({
                  trailColor: colorTheme === "default" ?'#201f1f'
                              : colorTheme === "blue" ? '#93c5fd'
                              : colorTheme === "green" ? '#86efac'
                              : colorTheme === "red" ? '#fca5a5'
                              : colorTheme === "yellow" ? '#fde047'
                              : colorTheme === "purple" ? '#d8b4fe'
                              : colorTheme === "pink" ? '#fbb6ce'
                              : colorTheme === "teal" ? '#6ee7b7'
                              : colorTheme === "orange" ? '#f6ad55'
                              : '#c084fc',
                     pathColor: colorTheme === "default" ? '#4b4a4a'
                              : colorTheme === "blue" ? '#60a5fa'
                              : colorTheme === "green" ? '#4ade80'
                              : colorTheme === "red" ? '#f87171'
                              : colorTheme === "yellow" ? '#facc15'
                              : colorTheme === "purple" ? '#c084fc'
                              : colorTheme === "pink" ? '#f472b6'
                              : colorTheme === "teal" ? '#34d399'
                              : colorTheme === "orange" ? '#f97316'
                              : '#8b5cf6',
                  pathTransitionDuration: 0.5,
                  strokeLinecap: 'round',
                })}
                className="w-44 h-44 sm:w-40 sm:h-40"
                strokeWidth={4}
              />

              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <div className="flex items-center gap-1.5">
                  <Bell size={16} fill="currentColor" />
                  {dayJS(endAt).format("HH:mm")}
                </div>

                {!isEnded && <div className="text-2xl font-bold">
                  {formatRemainingTime(timeLeft)}
                </div>}
                {isEnded && <div className="text-2xl font-bold">00:00</div>}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <X
                fill="currentColor"
                strokeWidth={4}
                size={30}
                onClick={() => {
                  deleteTimer(id);
                  toggleStop();
                }}
                className={colorScheme(colorTheme, "cursor-pointer rounded-full p-1.5 text-primary-foreground")}
              />

              {!isPaused ? (
                <Pause
                  fill="currentColor"
                  size={30}
                  onClick={() => !isEnded && togglePaused(id)}
                  className={colorScheme(colorTheme, "cursor-pointer rounded-full p-1.5 text-primary-foreground", { "opacity-50 hover:cursor-not-allowed": isEnded})}
                />
              ) : (
                <Play
                  fill="currentColor"
                  size={30}
                  onClick={() => !isEnded && togglePaused(id)}
                  className={colorScheme(colorTheme, "cursor-pointer rounded-full p-1.5 text-primary-foreground", { "opacity-50 hover:cursor-not-allowed": isEnded})}
                />
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {title || "Chronomètre sans titre"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const colorScheme = (colorTheme: Timer["colorTheme"], ...inputs: ClassValue[]): string => {
  return cn(...inputs, {
    "text-gray-900 dark:text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-300 bg-gray-100 dark:bg-gray-400": colorTheme === "default",
    "text-blue-900 dark:text-blue-900 hover:bg-blue-200 dark:hover:bg-blue-300 bg-blue-100 dark:bg-blue-400": colorTheme === "blue",
    "text-yellow-900 dark:text-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-300 bg-yellow-100 dark:bg-yellow-400": colorTheme === "yellow",
    "text-green-900 dark:text-green-900 hover:bg-green-200 dark:hover:bg-green-300 bg-green-100 dark:bg-green-400": colorTheme === "green",
    "text-red-900 dark:text-red-900 hover:bg-red-200 dark:hover:bg-red-300 bg-red-100 dark:bg-red-400": colorTheme === "red",
    "text-purple-900 dark:text-purple-900 hover:bg-purple-200 dark:hover:bg-purple-300 bg-purple-100 dark:bg-purple-400": colorTheme === "purple",
    "text-pink-900 dark:text-pink-900 hover:bg-pink-200 dark:hover:bg-pink-300 bg-pink-100 dark:bg-pink-400": colorTheme === "pink",
    "text-teal-900 dark:text-teal-900 hover:bg-teal-200 dark:hover:bg-teal-300 bg-teal-100 dark:bg-teal-400": colorTheme === "teal",
    "text-orange-900 dark:text-orange-900 hover:bg-orange-200 dark:hover:bg-orange-300 bg-orange-100 dark:bg-orange-400": colorTheme === "orange",
    "text-indigo-900 dark:text-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-300 bg-indigo-100 dark:bg-indigo-400": colorTheme === "indigo"
  });
}