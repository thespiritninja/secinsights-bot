"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "./ui/textarea";
import { FaArrowUp, FaArrowUpAZ } from "react-icons/fa6";

const formSchema = z.object({
  question: z.string().min(2, {
    message: "Question should be more than 2 characters",
  }),
});

export default function Chatbox() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    form.resetField("question");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ask a question...</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What is the turnover ratio for the year?"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Start conversation by asking questions!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button className="rounded-full" type="submit">
            <FaArrowUp />
          </Button>
        </div>
      </form>
    </Form>
  );
}
