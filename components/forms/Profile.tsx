"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { ProfileSchema } from "@/lib/validation";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";

interface Props {
  clerkId: string;
  user: string;
}

interface FormFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  type?: "text" | "url" | "textarea" | undefined;
}

const CustomFormField: React.FC<FormFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>
          {label}{" "}
          {(name === "name" || name === "username") && (
            <span className="text-primary-500 dark:text-primary-500">*</span>
          )}
        </FormLabel>
        <FormControl>
          {type === "textarea" ? (
            <Textarea
              placeholder={placeholder}
              {...field}
              className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 bio-scrollbar h-[30vh] min-h-[56px] border"
            />
          ) : (
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
            />
          )}
        </FormControl>
        <FormMessage className="text-destructive dark:text-destructive" />
      </FormItem>
    )}
  />
);

// Use the CustomFormField component in your Profile component
const Profile = ({ clerkId, user }: Props) => {
  const parsedUser = JSON.parse(user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 1. Define your form.
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: parsedUser.name || "",
      username: parsedUser.username || "",
      portfolioWebsite: parsedUser.portfolioWebsite || "",
      location: parsedUser.location || "",
      bio: parsedUser.bio || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    setIsSubmitting(true);

    try {
      const { name, username, portfolioWebsite, location, bio } = values;

      //   update the user
      await updateUser({
        clerkId,
        updateData: { name, username, portfolioWebsite, location, bio },
        path: pathname,
      });

      toast({
        title: "Profile saved successfully",
        variant: "default",
      });

      router.back();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Uh oh! Something went wrong. Please try again",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-9 flex w-full flex-col gap-6"
      >
        <CustomFormField
          control={form.control}
          name="name"
          label="Name"
          placeholder="Your name"
        />
        <CustomFormField
          control={form.control}
          name="username"
          label="Username"
          placeholder="Your username"
        />
        <CustomFormField
          control={form.control}
          name="portfolioWebsite"
          label="Portfolio Link"
          placeholder="Your portfolio URL"
        />
        <CustomFormField
          control={form.control}
          name="location"
          label="Location"
          placeholder="Where are you from?"
        />
        <CustomFormField
          control={form.control}
          name="bio"
          label="Bio"
          placeholder="What's special about you?"
          type="textarea"
        />

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;
