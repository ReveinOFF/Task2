import { Metadata } from "next";
import AddClient from "./addClient";

export const metadata: Metadata = {
  title: "Add event",
  description: "Create your event",
};

export default function Add() {
  return <AddClient />;
}
