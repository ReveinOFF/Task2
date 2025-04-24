"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import axios from "@/services/axios";
import { setCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleAuth from "@/components/googleAuth/google";

const schema = z
  .object({
    email: z
      .string()
      .email("Please enter a valid email")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .min(1, "Password is required"),
    confpassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data: any) => data.password === data.confpassword, {
    message: "Passwords don't match",
    path: ["confpassword"],
  });

type FormData = z.infer<typeof schema>;

export default function SignUpClient() {
  const router = useRouter();
  const [visibleEyes, setVisibleEyes] = useState({
    password: false,
    confirmPassword: false,
  });

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
      const response = await axios.post("/auth/registration", data);
      return response.data;
    },
    onSuccess: (data) => {
      setCookie("at", data);
      router.push("/");
    },
    onError: (error: any) => {
      if (error.response.data.error.message === "Email is already taken")
        setError("email", {
          type: "manual",
          message: "Email is already taken",
        });
    },
  });

  const onSubmit = async (data: FormData) => {
    await mutation.mutateAsync(data);
  };

  const toggleVisibility = (field: "password" | "confirmPassword") => {
    setVisibleEyes((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <>
      <h1>Sign Up</h1>
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
              type={visibleEyes.password ? "text" : "password"}
              {...register("password")}
            />
            <button onClick={() => toggleVisibility("password")} type="button">
              <Image
                src={
                  visibleEyes.password
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
        <fieldset className="fieldset">
          <label htmlFor="password">Repeat Password</label>
          <div>
            <input
              id="repPassword"
              type={visibleEyes.confirmPassword ? "text" : "password"}
              {...register("confpassword")}
            />
            <button
              onClick={() => toggleVisibility("confirmPassword")}
              type="button"
            >
              <Image
                src={
                  visibleEyes.confirmPassword
                    ? "/assets/icons/passwordEyeV.svg"
                    : "/assets/icons/passwordEyeH.svg"
                }
                width={20}
                height={20}
                alt="eye"
              />
            </button>
          </div>
          {errors.confpassword && <p>{errors.confpassword.message}</p>}
        </fieldset>
        <button type="submit">Sign Up</button>
      </form>
      <hr className="w-[400px]" />
      <GoogleAuth />
      <div className="my-2.5 after:ml-0.5 before:mr-0.5 after:content-['\2014\2014\2014\2014'] before:content-['\2014\2014\2014\2014']">
        or
      </div>
      <Link href="/auth/signin" className="link">
        Sign In
      </Link>
    </>
  );
}
