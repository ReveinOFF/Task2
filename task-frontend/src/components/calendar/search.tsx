"use client";

import { useState } from "react";

export default function Search({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="mb-2.5">
      <input
        type="text"
        placeholder="Search by events"
        value={query}
        onChange={handleChange}
        className="bg-gray-600 w-full py-4 px-3 rounded-2xl"
      />
    </div>
  );
}
