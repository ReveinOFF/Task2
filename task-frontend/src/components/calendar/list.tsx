"use client";

import { Event } from "@/types/event";
import { useRouter } from "next/navigation";
import React from "react";

export default function EventList({
  events,
  removeEvent,
  date,
}: {
  events: Event[];
  removeEvent: (id: string) => void;
  date: string;
}) {
  const router = useRouter();

  return (
    <>
      {events.length === 0 ? (
        <div>
          <div>Events is not found</div>
          <button
            className="bg-green-800 py-3 px-5 rounded-[10px]"
            onClick={() => router.push(`/add?date=${date}`)}
          >
            Add
          </button>
        </div>
      ) : (
        <ul>
          {events.map((event: any) => (
            <div key={event._id}>
              <li>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>{new Date(event.date).toLocaleDateString()}</p>
                <span>{event.importance}</span>
              </li>
              <div className="flex gap-2">
                <button
                  className="bg-orange-600 py-3 px-5 rounded-[10px]"
                  onClick={() => router.push(`/${event._id}`)}
                >
                  Update
                </button>
                <button
                  className="bg-red-600 py-3 px-5 rounded-[10px]"
                  onClick={() => removeEvent(event._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </ul>
      )}
    </>
  );
}
