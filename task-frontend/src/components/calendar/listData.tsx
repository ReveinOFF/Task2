"use client";

import { Event } from "@/types/event";

export default function ListData({
  events,
  onDateSelect,
}: {
  events: Event[];
  onDateSelect: (date: string) => void;
}) {
  return (
    <div className="grid">
      {events.map((item) => (
        <div
          key={item._id}
          className="p-2 border cursor-pointer hover:bg-gray-500"
          onClick={() => onDateSelect(item.date)}
        >
          <div>{item.date}</div>
          <div>{item.title}</div>
        </div>
      ))}
    </div>
  );
}
