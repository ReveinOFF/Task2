"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";

import axios from "@/services/axiosAuth";
import Link from "next/link";
import { useEffect } from "react";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string(),
  importance: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function UpdateClient({ id }: { id: string }) {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["repoData2"],
    queryFn: async () => (await axios.get(`/event/${id}`)).data,
  });

  useEffect(() => {
    if (data) {
      setValue("title", data.title);
      setValue("description", data.description);
      setValue("date", data.date);
      setValue("importance", data.importance);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      date: string;
      importance: string;
    }) => {
      const response = await axios.put(`/event/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      alert("Event updated");
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
      <h1 className="mt-5">Update event</h1>
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
        <button type="submit">Update</button>
      </form>
      <Link href="/" className="flex justify-center">
        Close
      </Link>
    </>
  );
}
