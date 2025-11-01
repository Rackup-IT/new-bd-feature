import { z } from "zod";

import { baseSchema } from "./base";

export const serverSideValidationSchema = baseSchema.extend({
  image: z.string().min(1, "Image is required"),
});

// here we not use any preprocessing or transfrom of data
// so the here we don't have any input
// here we only have output
// but for consistency we write the name as output

export type ServerSideOutputSchema = z.infer<typeof serverSideValidationSchema>; // here we got image as File type
