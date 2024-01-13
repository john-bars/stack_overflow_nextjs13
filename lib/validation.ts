import * as z from "zod";

export const questionsSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(20),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export const AnswerSchema = z.object({
  answer: z.string().min(100),
});

const isValidURL = (value: string) => {
  const isURL = value === "" || /^https?:\/\/\S+$/.test(value);
  if (!isURL) {
    return false;
  }
  return true;
};

export const ProfileSchema = z.object({
  name: z
    .string()
    .max(50)
    .refine((value) => value && value.length >= 3, {
      message: "Name must be at least 3 characters",
    }),
  username: z
    .string()
    .max(50)
    .refine((value) => value && value.length >= 3, {
      message: "username must be at least 3 characters",
    }),
  bio: z
    .string()
    .optional()
    .refine((value) => value === "" || (value && value.length >= 3), {
      message: "Bio must be at least 3 characters",
    })
    .refine((value) => value === "" || (value && value.length <= 2000), {
      message: "Bio must not be more than 2000 characters",
    }),

  location: z
    .string()
    .optional()
    .refine((value) => value === "" || value!.length <= 50, {
      message: "Please provide proper location",
    }),
  portfolioWebsite: z
    .string()
    .refine(isValidURL, { message: "Please provide a valid URL" }),
});
