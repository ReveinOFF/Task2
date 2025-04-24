import { Metadata } from "next";
import HomeClient from "./homeClient";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Look at your task list",
};

export default function Home() {
  return <HomeClient />;
}
