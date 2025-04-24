"use client";

import Link from "next/link";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "@/services/axios";
import { setCookie } from "cookies-next/client";
import Image from "next/image";
import GoogleAuth from "@/components/googleAuth/google";

const schema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function SignInClient() {
  const router = useRouter();
  const [showEye, setShowEye] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await axios.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      setCookie("at", data);
      router.push("/");
    },
    onError: (error: any) => {
      if (
        error.response.data.error.message === "Incorrect password" ||
        error.response.data.error.message === "User not found"
      )
        setError("email", {
          type: "manual",
          message: "Invalid data or user does not exist",
        });
    },
  });

  const onSubmit = async (data: FormData) => {
    await mutation.mutateAsync(data);
  };

  return (
    <>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <fieldset className="fieldset">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </fieldset>
        <fieldset className="fieldset">
          <label htmlFor="password">Password</label>
          <div>
            <input
              id="password"
              type={showEye ? "text" : "password"}
              {...register("password")}
            />
            <button onClick={() => setShowEye((prev) => !prev)} type="button">
              <Image
                src={
                  showEye
                    ? "/assets/icons/passwordEyeV.svg"
                    : "/assets/icons/passwordEyeH.svg"
                }
                width={20}
                height={20}
                alt="eye"
              />
            </button>
          </div>
          {errors.password && <p>{errors.password.message}</p>}
        </fieldset>
        <button type="submit">Sign In</button>
      </form>
      <hr className="w-[400px]" />
      <GoogleAuth />
      <div className="my-2.5 after:ml-0.5 before:mr-0.5 after:content-['\2014\2014\2014\2014'] before:content-['\2014\2014\2014\2014']">
        or
      </div>
      <Link href="/auth/signup" className="link">
        Sign Up
      </Link>
    </>
  );
}
