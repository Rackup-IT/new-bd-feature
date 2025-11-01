import { z } from "zod";

export const baseSchema = z.object({
  name: z.string().min(3, "name is required"),
  occupation: z.string().min(5, "occupation is required"),
  bio: z.string().min(10, "please enter at least 10 letter long bio"),
  location: z.string().optional(),
  website: z.string().optional(),
});
