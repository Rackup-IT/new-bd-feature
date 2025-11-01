import { z } from "zod";

export const baseSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(3, "Title require at least 3 characters"),
  edition: z.enum(["global", "bangladesh"], {
    errorMap: (issue, ctx) => ({
      message: `Edition must be either 'global' or 'local'.${issue} : ${ctx}`,
    }),
  }),
  href: z.string().min(3, "href require at least 3 characters"),
});
