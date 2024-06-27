"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { Component } from "./ui/component";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { dayJS } from "@/lib/dayjs/day-js";
import { Flame, ScanEye, Waves } from "lucide-react";
import { useTimers } from "@/lib/stores/timers.store";

export const FocusMode: Component<PropsWithChildren> = ({ children }) => {
  const { timers, toggleFocused } = useTimers();
  const [time, setTime] = useState<string>(dayJS().format("HH:mm"));

  const [focusType, setFocusType] = useState<"flame" | "waves">("flame");

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTime(dayJS().format("HH:mm"));
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);
  
  if (!timers.some(timer => timer.isFocused)) return <>{children}</>;

  return (
    <div className="relative">
      <div className={cn(
        "bottom-0 left-0 fixed inset-0 z-[80]",
        "flex p-3 justify-center items-end",
        "transition-all duration-200",
        "space-y-4"
      )}>
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-5xl font-bold text-white">{time}</h1>
          
          <Button
            variant="secondary"
            className="flex items-center gap-1 rounded-full opacity-5 hover:opacity-100 transition-all duration-200"
            onClick={() => toggleFocused(timers.find(timer => timer.isFocused)!.id)}>
            <ScanEye size={16} className="inline-block" />
            Exit the Focus Mode
          </Button>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-[90]">
        <Button
          variant={focusType === "flame" ? "blue" : "destructive"}
          onClick={() => setFocusType(focusType === "flame" ? "waves" : "flame")}
          className="rounded-full flex items-center gap-1 opacity-5 hover:opacity-100 transition-all duration-200"
        >
          Switch to
          {focusType === "flame" && <Waves size={16} className="inline-block" />}
          {focusType === "waves" && <Flame size={16} className="inline-block" />}
        </Button>
      </div>

      <div className="blur-[50px] fixed inset-0 z-50 flex items-center justify-center">
        <video
          autoPlay
          key={focusType}
          loop
          muted
          playsInline
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)',
            zIndex: '-1'
          }}
        >
          <source src={`/${focusType == "flame" ? "campfire" : "waves"}.mp4`} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}