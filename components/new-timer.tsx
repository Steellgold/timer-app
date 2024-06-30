"use client";

import { PropsWithChildren, ReactElement, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn, numberFormat } from "@/lib/utils";
import { useTimers } from "@/lib/stores/timers.store";
import { dayJS } from "@/lib/dayjs/day-js";
import { Component } from "./ui/component";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { AudioWaveform, Drum, Guitar, Piano } from "lucide-react";
import { AudioType } from "@/lib/stores/audio.store";

const inputStyles = cn(
  "w-20 h-16",
  "sm:w-24 sm:h-20",
  "md:w-28 md:h-24",
  "lg:w-32 lg:h-28",
  "bg-[#d4d0ca] focus:bg-[#c2bfba] dark:bg-[#201f1f] dark:focus:bg-[#201d1d]",
  "rounded-md text-center text-5xl focus:text-accent-content focus:outline-none md:text-6xl lg:text-7xl"
);

export const NewTimerDrawer: Component<PropsWithChildren & {
  isCard?: boolean;
}> = ({ children = null, isCard = false }): ReactElement => {
  const { timers, createTimer } = useTimers();

  const [hours, setHours] = useState<string>("00");
  const [minutes, setMinutes] = useState<string>("00");
  const [seconds, setSeconds] = useState<string>("00");

  const [timerName, setTimerName] = useState<string>("");
  const [song, setSong] = useState<AudioType["song"]>("drums");

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  return (
    <Drawer onClose={() => {
      setHours("00");
      setMinutes("00");
      setSeconds("00");
      setTimerName("");
    }} open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        {isCard ? children : (
          <Button>Create Timer</Button>
        )}
      </DrawerTrigger>
      
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg h-full flex flex-col space-y-4">
          <DrawerHeader className="flex flex-col items-center justify-center space-y-2">
            <DrawerTitle>Create a new timer</DrawerTitle>
            <DrawerDescription>Enter the name of the timer you want to create.</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col space-y-2 items-center">
            <div className="flex flex-row items-center space-x-2">
              <Input placeholder="Timer name (optional)" className="w-3/4" value={timerName} onChange={(e) => setTimerName(e.target.value)} />
              <Tabs defaultValue="tambour" onValueChange={(value) => setSong(value as AudioType["song"])}>
                <TabsList className="flex gap-2 justify-center">
                  <TabsTrigger value="tambour" className="flex gap-1 justify-center items-center"><Drum size={16} /></TabsTrigger>
                  <TabsTrigger value="guitar" className="flex gap-1 justify-center items-center"><Guitar size={16} /></TabsTrigger>
                  <TabsTrigger value="piano" className="flex gap-1 justify-center items-center"><Piano size={16} /></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex justify-center space-x-2">
              <Input placeholder="00" type="number" value={hours} max={24}
                onChange={(e) => setHours(numberFormat(e.target.value, 24))}
                className={inputStyles}
              />

              <Input placeholder="00" type="number" value={minutes} max={60}
                onChange={(e) => setMinutes(numberFormat(e.target.value ?? 0, 59))}
                className={inputStyles}
              />

              <Input placeholder="00" type="number" value={seconds} max={60}
                onChange={(e) => setSeconds(numberFormat(e.target.value ?? 0, 59))}
                className={inputStyles}
              />
            </div>
          </div>


          <DrawerFooter>
            <p className="text-muted-foreground text-xs text-center">Click outside the drawer to cancel.</p>
            <Button size={"sm"}
              onClick={() => {
                const startTimestamp = dayJS().valueOf();
                let endTimestamp = dayJS(startTimestamp);
                if (Number(hours) !== 0) {
                  console.log("hours", hours);
                  endTimestamp = endTimestamp.add(Number(hours), "hours");
                }

                if (Number(minutes) !== 0) {
                  console.log("minutes", minutes);
                  endTimestamp = endTimestamp.add(Number(minutes), "minutes");
                }

                if (Number(seconds) !== 0) {
                  console.log("seconds", seconds);
                  endTimestamp = endTimestamp.add(Number(seconds), "seconds");
                }
                console.log(hours, minutes, seconds, endTimestamp.valueOf());

                createTimer({
                  id: Math.random().toString(36),
                  title: timerName,
                  position: Math.max(...timers.map(timer => timer.position), 0) + 1,
                  startAt: startTimestamp,
                  endAt: endTimestamp.valueOf(),
                  isFocused: false,
                  isPaused: false,
                  pausedAt: 0,
                  pinned: false,
                  song: song,
                  colorTheme: "default"
                });

                setHours("00");
                setMinutes("00");
                setSeconds("00");
                setTimerName("");

                setIsDrawerOpen(false);
              }}
            >
              Submit
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}