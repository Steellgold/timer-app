"use client";

import { ReactElement, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input";

import { cn, numberFormat } from "@/lib/utils";
import { useTimers } from "@/lib/stores/timers.store";
import { dayJS } from "@/lib/dayjs/day-js";

const inputStyles = cn(
  "w-20 h-16",
  "sm:w-24 sm:h-20",
  "md:w-28 md:h-24",
  "lg:w-32 lg:h-28",
  "bg-[#d4d0ca] focus:bg-[#c2bfba] dark:bg-[#201f1f] dark:focus:bg-[#201d1d]",
  "rounded-md text-center text-5xl focus:text-accent-content focus:outline-none md:text-6xl lg:text-7xl"
);

export const NewTimerDrawer = (): ReactElement => {
  const { timers, createTimer } = useTimers();

  const [hours, setHours] = useState<string>("00");
  const [minutes, setMinutes] = useState<string>("00");
  const [seconds, setSeconds] = useState<string>("00");

  const [timerName, setTimerName] = useState<string>("");

  return (
    <Drawer onClose={() => {
      setHours("00");
      setMinutes("00");
      setSeconds("00");
      setTimerName("");
    }}>
      <DrawerTrigger asChild>
        <Button>Create Timer</Button>
      </DrawerTrigger>
      
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg h-full flex flex-col space-y-4">
          <DrawerHeader className="flex flex-col items-center justify-center space-y-2">
            <DrawerTitle>Create a new timer</DrawerTitle>
            <DrawerDescription>Enter the name of the timer you want to create.</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col space-y-2 items-center">
            <Input placeholder="Timer name (optional)" className="w-3/4" value={timerName} onChange={(e) => setTimerName(e.target.value)} />

            <div className="flex justify-center space-x-2">
              <Input placeholder="00" value={hours} max={24}
                onChange={(e) => setHours(numberFormat(e.target.value, 24))}
                className={inputStyles}
              />

              <Input placeholder="00" value={minutes} max={60}
                onChange={(e) => setMinutes(numberFormat(e.target.value, 59))}
                className={inputStyles}
              />

              <Input placeholder="00" value={seconds} max={60}
                onChange={(e) => setSeconds(numberFormat(e.target.value, 59))}
                className={inputStyles}
              />
            </div>
          </div>

          <DrawerFooter>
            <p className="text-muted-foreground text-xs text-center">Click outside the drawer to cancel.</p>
            <Button size={"sm"}
              onClick={() => {
                const startedAt = new Date();
                startedAt.setHours(+hours);
                startedAt.setMinutes(+minutes);
                startedAt.setSeconds(+seconds);

                createTimer({
                  id: timers.length + 1,
                  name: timerName,
                  position: timers.length + 1,
                  startedAt: dayJS(),
                  endedAt: dayJS().add(+hours, "hours").add(+minutes, "minutes").add(+seconds, "seconds"),
                  endSong: "default",
                  isPaused: false,
                  backgroundImage: null,
                  pinned: false,
                });

                setHours("00");
                setMinutes("00");
                setSeconds("00");
                setTimerName("");
              }}
            >
              Submit</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}