import { z } from "zod";

import { baseSchema } from "./base";

export const dbResponseValidationSchema = baseSchema.extend({
  _id: z.string().optional(),
  keywords: z.string().min(1, "Keywords is required"),
  image: z.string().min(1, "Image is required"),
  createdAt: z.string({ message: "createdAt is required" }),
  updatedAt: z.string().optional(), // Add updatedAt field
  slug: z.string().min(1, "slug is required"),
  index: z.number().optional(),
});

// this schema is not for validating data
// its only for getting data from database
// use this one like other interface/model
// because we can't use this as a validaiton
// so its not metter we take input/output
// but for consistency we write the name as output & also get the OUTPUT
// for safty
export type DBResponseSchema = z.infer<typeof dbResponseValidationSchema>;
