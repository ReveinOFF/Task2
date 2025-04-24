"use client";

import Calendar from "@/components/calendar/calendar";
import Filter from "@/components/calendar/filter";
import EventList from "@/components/calendar/list";
import Search from "@/components/calendar/search";
import { Event, Importance } from "@/types/event";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import axios from "@/services/axiosAuth";
import ListData from "@/components/calendar/listData";

export default function HomeClient() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("calendar");

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/event/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      alert("Event deleted");
    },
    onError: (error: any) => {
      console.log(error);
      alert(error);
    },
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: async () => ((await axios.get(`/event`)).data as Event[]) || [],
  });

  useEffect(() => {
    if (data) {
      setFilteredEvents(data);
    }
  }, [data]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const events = (data as Event[]).filter((event) =>
      event.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEvents(events);
  };

  const handleFilter = (importance: Importance | "all") => {
    if (importance === "all") {
      setFilteredEvents(data as Event[]);
    } else {
      setFilteredEvents(
        (data as Event[]).filter((event) => event.importance === importance)
      );
    }
  };

  const eventsForSelectedDate = filteredEvents.filter((event) =>
    event.date.startsWith(selectedDate ?? "")
  );

  const handleRemove = async (id: string) => {
    await mutation.mutateAsync(id);

    const events = data?.filter((event) => event._id !== id);
    setFilteredEvents(events || []);
  };

  return (
    <div>
      <h1 className="mt-5">Events</h1>
      <Search onSearch={handleSearch} />
      <Filter onFilter={handleFilter} />
      <div className="flex justify-around px-10 mb-4">
        <button onClick={() => setFilter("list")}>List</button>
        <button onClick={() => setFilter("calendar")}>Calendar</button>
      </div>
      {filter === "list" ? (
        <ListData events={filteredEvents} onDateSelect={handleDateSelect} />
      ) : (
        <Calendar events={filteredEvents} onDateSelect={handleDateSelect} />
      )}
      {selectedDate && (
        <>
          <h2>Events for {selectedDate}</h2>
          <EventList
            events={eventsForSelectedDate}
            date={selectedDate}
            removeEvent={handleRemove}
          />
        </>
      )}
    </div>
  );
}
