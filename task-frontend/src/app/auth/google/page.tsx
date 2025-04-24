"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next/client";

export default function GoogleAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("at");

    if (token) {
      setCookie("at", token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      router.replace("/");
    } else {
      router.replace("/login");
    }
  }, [searchParams, router]);

  return <p>Вход через Google...</p>;
}
