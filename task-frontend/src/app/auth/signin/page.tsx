import { Metadata } from "next";
import SignInClient from "./signInClient";

export const metadata: Metadata = {
  title: "Sign In",
  description: "This is where you can log in",
};

export default function SignIn() {
  return <SignInClient />;
}
