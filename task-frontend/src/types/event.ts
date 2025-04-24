export type Importance = "ordinary" | "important" | "critical" | "all";

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  importance: Importance;
}
