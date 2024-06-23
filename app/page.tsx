"use client";

import { CircleProgressTimer } from "@/components/circle";
import { NewTimerDrawer } from "@/components/new-timer";
import { dayJS } from "@/lib/dayjs/day-js";
import { useTimers } from "@/lib/stores/timers.store";
import { cn } from "@/lib/utils";
import { Pause, Pin, PinOff, Play, Plus, X } from "lucide-react";
import { useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function Home() {
  const { timers, deleteTimer, togglePaused, togglePinned, checkElapseds, updatePosition } = useTimers();

  useEffect(() => {
    checkElapseds();
  }, [checkElapseds]);

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const movedTimer = timers[source.index];
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

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="timers" direction="horizontal">
        {(provided) => (
          <div
            className="flex flex-col sm:flex-row gap-1 flex-wrap"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {sortedTimers.map((timer, index) => (
              <Draggable key={timer.id} draggableId={timer.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-[#d1ccc7] dark:bg-[#131212] border border-[#201f1f1c] rounded-xl p-4 sm:w-[200px]"
                  >
                    <div className="flex justify-between flex-row-reverse">
                      <p>
                        {timer.name}
                      </p>
                      {!timer.pinned ? (
                        <Pin
                          fill="currentColor"
                          size={30}
                          onClick={() => timers.every((timer) => !timer.pinned) ? togglePinned(timer.id) : null}
                          className={cn(
                            "cursor-pointer rounded-full p-1.5 text-primary-foreground", {
                              "dark:text-blue-900 bg-blue-100 dark:bg-blue-400": timers.every((timer) => !timer.pinned),
                              "hover:bg-blue-200 dark:hover:bg-blue-300": timers.every((timer) => !timer.pinned),
                              "dark:text-gray-900 bg-gray-100 dark:bg-gray-400": timers.some((timer) => timer.pinned),
                              "hover:bg-gray-200 dark:hover:bg-gray-300": timers.some((timer) => timer.pinned)
                            }
                          )}
                        />
                      ) : (
                        <PinOff
                          fill="currentColor" size={30}
                          onClick={() => togglePinned(timer.id)}
                          className={cn(
                            "cursor-pointer rounded-full p-1.5 text-primary-foreground",
                            "dark:text-blue-900 bg-blue-100 dark:bg-blue-400",
                            "hover:bg-blue-200 dark:hover:bg-blue-300"
                          )}
                        />
                      )}
                    </div>

                    <div className="flex justify-center items-center">
                      <CircleProgressTimer duration={
                        (dayJS(timer.endedAt).diff(timer.startedAt, "seconds") - (timer.elapsed ?? 0))
                      } isPaused={timer.isPaused} timerId={timer.id} />
                    </div>

                    <div className="flex justify-between">
                      <X
                        fill="currentColor"
                        size={30}
                        className={cn(
                          "cursor-pointer rounded-full p-1.5 text-primary-foreground",
                          "dark:text-red-900 bg-red-100 dark:bg-red-400",
                          "hover:bg-red-200 dark:hover:bg-red-300"
                        )}
                        onClick={() => deleteTimer(timer.id)}
                      />

                      {timer.isPaused ? (
                        <Play
                          fill="currentColor"
                          size={30}
                          onClick={() => togglePaused(timer.id)}
                          className={cn(
                            "cursor-pointer rounded-full p-1.5 text-primary-foreground",
                            "dark:text-green-900 bg-green-100 dark:bg-green-400",
                            "hover:bg-green-200 dark:hover:bg-green-300"
                          )}
                        />
                      ) : (
                        <Pause
                          fill="currentColor"
                          size={30}
                          onClick={() => togglePaused(timer.id)}
                          className={cn(
                            "cursor-pointer rounded-full p-1.5 text-primary-foreground",
                            "dark:text-yellow-900 bg-yellow-100 dark:bg-yellow-400",
                            "hover:bg-yellow-200 dark:hover:bg-yellow-300"
                          )}
                        />
                      )}
                    </div>
                  </div>
                )}
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
  );
}
