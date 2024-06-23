import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Bell } from 'lucide-react';
import { Component } from './ui/component';
import { dayJS } from '@/lib/dayjs/day-js';
import { cn } from '@/lib/utils';
import { useTimers } from '@/lib/stores/timers.store';

export const CircleProgressTimer: Component<{
  duration: number,
  isPaused: boolean,
  timerId: string
}> = ({ duration, isPaused, timerId }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [percentage, setPercentage] = useState(100);
  const { addElapsed } = useTimers();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        if (isPaused) return;
        setTimeLeft(timeLeft - 1);
        addElapsed(timerId, 1);
        setPercentage((timeLeft - 1) / duration * 100);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, duration, isPaused, timerId, addElapsed]);

  const renderTimeLeft = () => {
    if (timeLeft > 3600) {
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;
      return (
        <div className="flex items-center text-[1.2rem]">
          <span>{hours < 10 ? `0${hours}` : hours}</span>
          <span>:</span>
          <span>{minutes < 10 ? `0${minutes}` : minutes}</span>
          <span>:</span>
          <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
        </div>
      );
    } else if (timeLeft > 60) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      return (
        <div className="flex items-center text-3xl">
          <span>{minutes < 10 ? `0${minutes}` : minutes}</span>
          <span>:</span>
          <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
        </div>
      );
    } else {
      return <span className="text-5xl">{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>;
    }
  };

  return (
    <div className={cn(
      "flex justify-center items-center",
      "w-36 h-36 rounded-full"
    )}>
      <CircularProgressbar value={percentage} styles={buildStyles({ pathColor: '#fde047', trailColor: 'grey' })} strokeWidth={4} />
      
      <div className={cn(
        "absolute",
        "flex justify-center items-center",
        "w-36 h-36 rounded-full",
        "flex-col space-y-1.5",
      )}>
        <p className="text-sm flex items-center">
          <Bell size={16} />
          <span className="ml-1 text-sm">
            {dayJS().add(timeLeft, 'seconds').format('HH:mm')}
          </span>
        </p>

        {renderTimeLeft()}
      </div>
    </div>
  );
};