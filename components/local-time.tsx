"use client";

import { dayJS } from "@/lib/dayjs/day-js";
import { Clock, Clock1, Clock10, Clock11, Clock12, Clock2, Clock3, Clock4, Clock5, Clock6, Clock7, Clock8, Clock9 } from "lucide-react";
import { useEffect, useState } from "react";
import { Component } from "./ui/component";
import { Button } from "./ui/button";

export const CurrentTime = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const hour = dayJS(time).format("hh");
  const minute = dayJS(time).format("mm");

  return (
    <Button className="fixed top-4 left-4 z-50 flex items-center space-x-2">
      <ClockByHour hour={hour} />
      <span>{hour}:{minute}</span>
    </Button>
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