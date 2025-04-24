"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { Event } from "@/types/event";

export default function Calendar({
  events,
  onDateSelect,
}: {
  events: Event[];
  onDateSelect: (date: string) => void;
}) {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const startOfMonth = currentDate.startOf("month").startOf("week");
  const endOfMonth = currentDate.endOf("month").endOf("week");

  const days: dayjs.Dayjs[] = [];
  let d = startOfMonth;
  while (d.isBefore(endOfMonth) || d.isSame(endOfMonth)) {
    days.push(d);
    d = d.add(1, "day");
  }

  return (
    <div>
      <div className="flex justify-center gap-5">
        <button
          onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
        >
          ←
        </button>
        <span>{currentDate.format("MMMM YYYY")}</span>
        <button onClick={() => setCurrentDate(currentDate.add(1, "month"))}>
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 p-4">
        {days.map((day, idx) => {
          const dayEvents = events.filter((e: any) =>
            dayjs(e.date).isSame(day, "day")
          );
          return (
            <div
              key={idx}
              className="p-2 border cursor-pointer hover:bg-gray-500"
              onClick={() => onDateSelect(day.format("YYYY-MM-DD"))}
            >
              <div>{day.date()}</div>
              {dayEvents.length > 0 && (
                <div className="text-xs mt-1 text-blue-500">
                  {dayEvents.length} events
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
