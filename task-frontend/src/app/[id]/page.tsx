import { Metadata } from "next";
import UpdateClient from "./taskClient";

export const metadata: Metadata = {
  title: "Change event",
  description: "Change your event",
};

export default function Update({ params }: { params: { id: string } }) {
  return <UpdateClient id={params.id} />;
}
