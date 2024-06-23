"use client";

import { dayJS } from "@/lib/dayjs/day-js";
import { Clock, Clock1, Clock10, Clock11, Clock12, Clock2, Clock3, Clock4, Clock5, Clock6, Clock7, Clock8, Clock9 } from "lucide-react";
import { useEffect, useState } from "react";
import { Component } from "./ui/component";
import { Button } from "./ui/button";
import { useLocalTime } from "@/lib/stores/local-time.store";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Toggle } from "@/components/ui/toggle"
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";


export const CurrentTime = () => {
  const [time, setTime] = useState(new Date());
  const { format, setFormat, showSeconds, toggleSeconds } = useLocalTime();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const hour12 = dayJS(time).format("hh");
  const hour = dayJS(time).format(format === 12 ? "hh" : "HH");
  const minute = dayJS(time).format("mm");
  const second = dayJS(time).format("ss");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex items-center space-x-2">
          <ClockByHour hour={hour12} />
          <span>{hour}:{minute}{showSeconds ? `:${second}` : ""}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-4 space-y-2 ml-4">
        <div className="flex items-center space-x-2 w-full">
          <Toggle
            variant={"outline"}
            className="w-full"
            pressed={showSeconds}
            onPressedChange={toggleSeconds}>
            Show seconds
          </Toggle>
        </div>
        <div className="flex space-x-2 w-full">
          <Button onClick={() => setFormat(12)} className={cn("w-full", format === 24 ? "bg-gray-200" : "")}>12-hour</Button>
          <Button onClick={() => setFormat(24)} className={cn("w-full", format === 12 ? "bg-gray-200" : "")}>24-hour</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const ClockByHour: Component<{ hour: string }> = ({ hour }) => {
  switch (hour) {
    case "00":
      return <Clock size={16} />;
    case "01":
      return <Clock1 size={16} />;
    case "02":
      return <Clock2 size={16} />;
    case "03":
      return <Clock3 size={16} />;
    case "04":
      return <Clock4 size={16} />;
    case "05":
      return <Clock5 size={16} />;
    case "06":
      return <Clock6 size={16} />;
    case "07":
      return <Clock7 size={16} />;
    case "08":
      return <Clock8 size={16} />;
    case "09":
      return <Clock9 size={16} />;
    case "10":
      return <Clock10 size={16} />;
    case "11":
      return <Clock11 size={16} />;
    case "12":
      return <Clock12 size={16} />;
    default:
      return <Clock size={16} />;
  }
}