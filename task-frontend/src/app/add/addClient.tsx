"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import axios from "@/services/axiosAuth";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string(),
  importance: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function AddClient() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const date = searchParams.get("date");

    if (date) {
      setValue("date", date);
    }
  }, [searchParams]);

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      date: string;
      importance: string;
    }) => {
      const response = await axios.post("/event", data);
      return response.data;
    },
    onSuccess: (data) => {
      alert("Event created");
    },
    onError: (error: any) => {
      console.log(error);
      alert(error);
    },
  });

  const onSubmit = async (data: FormData) => {
    await mutation.mutateAsync(data);
  };

  return (
    <>
      <h1 className="mt-5">Add event</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form mx-auto">
        <fieldset className="fieldset">
          <label htmlFor="title">Title</label>
          <input id="title" type="text" {...register("title")} />
          {errors.title && <p>{errors.title.message}</p>}
        </fieldset>
        <fieldset className="fieldset">
          <label htmlFor="description">Description</label>
          <textarea id="description" {...register("description")}></textarea>
          {errors.description && <p>{errors.description.message}</p>}
        </fieldset>
        <fieldset className="fieldset">
          <label htmlFor="importance">Importance</label>
          <select {...register("importance")}>
            <option value="ordinary">Ordinary</option>
            <option value="important">Important</option>
            <option value="critical">Critical</option>
          </select>
        </fieldset>
        <button type="submit">Create</button>
      </form>
      <Link href="/" className="flex justify-center">
        Close
      </Link>
    </>
  );
}
