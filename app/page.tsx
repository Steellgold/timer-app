"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input";
import { dayJS } from "@/lib/dayjs/day-js";
import { useTimers } from "@/lib/stores/timers.store";
import { cn } from "@/lib/utils";
import { Timer } from "lucide-react";
import { useState } from "react";

const inputStyles = cn(
  "w-[110px] h-[110px]",
  "sm:w-[130px] sm:h-[130px]",
  "md:w-[140px] md:h-[140px]",
  "lg:w-[150px] lg:h-[150px]",
  "bg-[#d4d0ca] focus:bg-[#c2bfba] dark:bg-[#201f1f] dark:focus:bg-[#201d1d]",
  "rounded-md text-center text-5xl focus:text-accent-content focus:outline-none md:text-6xl lg:text-7xl"
);

export default function Home() {
  const { timers, createTimer } = useTimers();

  const [days, setDays] = useState<string>("00");
  const [hours, setHours] = useState<string>("00");
  const [minutes, setMinutes] = useState<string>("00");
  const [seconds, setSeconds] = useState<string>("00");
  
  if (!timers.length) return (
    <div className="flex justify-center items-center h-screen flex-col space-y-1.5">
      <p className="text-primary-foreground dark:text-[#d1ccc7] text-center text-lg">
        You don&apos;t have any timers yet, create one now!
      </p>

      <Drawer>
        <DrawerTrigger asChild>
          <Button>Create Timer</Button>
        </DrawerTrigger>
        
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg h-[36vh]">
            <DrawerHeader className="flex flex-col items-center justify-center space-y-2">
              <DrawerTitle>Create a new timer</DrawerTitle>
              <DrawerDescription>Enter the name of the timer you want to create.</DrawerDescription>
            </DrawerHeader>

            <div className="flex flex-col space-y-2">
              <Input placeholder="Timer name (optional)" />

              <div className="flex justify-center h-48 space-x-2">
                <Input placeholder="00" value={days} max={31}
                  onChange={(e) => setDays(e.target.value)}
                  className={inputStyles}
                />

                <Input placeholder="00" value={hours} max={24}
                  onChange={(e) => setHours(e.target.value)}
                  className={inputStyles}
                />

                <Input placeholder="00" value={minutes} max={60}
                  onChange={(e) => setMinutes(e.target.value)}
                  className={inputStyles}
                />

                <Input placeholder="00" value={seconds} max={60}
                  onChange={(e) => setSeconds(e.target.value)}
                  className={inputStyles}
                />
              </div>
            </div>

            <DrawerFooter>
              <p className="text-muted-foreground text-xs text-center">Click outside the drawer to cancel.</p>
              <Button size={"sm"}>Submit</Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )

  return (
    <div>
      <p>
        This is a Next.js app with TypeScript, Tailwind CSS, and Lucide Icons.
      </p>
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