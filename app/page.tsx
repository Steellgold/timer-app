"use client";

import { CircleProgressTimer } from "@/components/circle";
import { NewTimerDrawer } from "@/components/new-timer";
import { dayJS } from "@/lib/dayjs/day-js";
import { cn } from "@/lib/utils";
import { Pause, Pin, PinOff, Play, Plus, Scan, X } from "lucide-react";
import { useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTimers } from "@/lib/stores/timers.store";
import { TimerCard } from "@/components/card";

export default function Home() {
  const { timers, deleteTimer, togglePaused, togglePinned, updatePosition, toggleFocused } = useTimers();

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const movedTimer = timers[source.index];

    if (movedTimer.pinned) return;
    if (destination.index === 0 && timers.some(timer => timer.pinned)) return;

    updatePosition(movedTimer.id, destination.index);
  };

  if (!timers.length) return (
    <div className="flex justify-center items-center h-screen flex-col space-y-1.5">
      <p className="text-primary-foreground dark:text-[#d1ccc7] text-center text-lg">
        You don&apos;t have any timers yet, create one now!
      </p>

      <NewTimerDrawer />
    </div>
  )

  const sortedTimers = [...timers].sort((a, b) => a.position - b.position);

  return <>
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="timers" direction="horizontal">
        {(provided) => (
          <div
            className="flex flex-col sm:flex-row gap-1 flex-wrap"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {sortedTimers.map((timer, index) => (
              <Draggable key={timer.id} draggableId={timer.id.toString()} index={index} isDragDisabled={timer.pinned}>
                {(provided) => <TimerCard {...timer} provided={provided} />}
              </Draggable>
            ))}

            {provided.placeholder}

            {timers.length >= 1 && (
              <NewTimerDrawer isCard>
                <div className="cursor-pointer bg-[#d1ccc7] dark:bg-[#131212] border border-[#201f1f1c] rounded-xl p-4 sm:w-[200px] flex justify-center items-center">
                  <Plus
                    fill="currentColor"
                    size={30}
                    onClick={() => null}
                    className={cn(
                      "cursor-pointer rounded-full p-1.5 text-primary-foreground",
                      "dark:text-[#201f1f] bg-[#201f1f] dark:bg-[#f7f1eb] text-[#f7f1eb]"
                    )}
                  />
                </div>
              </NewTimerDrawer>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>

    <pre>
      {JSON.stringify(timers, null, 2)}
    </pre>
  </>;
}
