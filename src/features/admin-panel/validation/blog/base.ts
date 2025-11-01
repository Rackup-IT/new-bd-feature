import { z } from "zod";

export const baseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  section: z.string().min(1, "Section is required"),
  content: z
    .string()
    .refine((val) => val.length >= 50, { message: "Need more content to go" }),
  desscription: z.string().min(1, "Desscription is required"),
  edition: z.string().min(1, "Edition is required"),
  writter: z.any().optional(),
  keywords: z.array(z.string()).min(1, "Keywords is required"),
  status: z.any().optional(),
});

// Image preprocessing
export const imagePreprocess = z.preprocess((val) => {
  if (val instanceof FileList && val.length > 0) {
    return val[0];
  }
  return val;
}, z.any());
