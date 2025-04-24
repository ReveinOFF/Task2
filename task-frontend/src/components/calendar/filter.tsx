"use client";

import { Importance } from "@/types/event";

export default function Filter({
  onFilter,
}: {
  onFilter: (importance: Importance | "all") => void;
}) {
  return (
    <div className="flex justify-around px-10 mb-4">
      <button onClick={() => onFilter("all")}>All</button>
      <button onClick={() => onFilter("ordinary")}>Ordinary</button>
      <button onClick={() => onFilter("important")}>Important</button>
      <button onClick={() => onFilter("critical")}>Critical</button>
    </div>
  );
}
