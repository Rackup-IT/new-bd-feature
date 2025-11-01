import { z } from "zod";

import { baseSchema } from "./base";

// This is the edit server side validation schema
// becase client side need to access the FileList we can't use it
// server don't know what is FileList
// so we need to use the File type
export const editServerSideValidationSchema = baseSchema.extend({
  image: z.union([
    z.instanceof(File, { message: "A image is required!" }),
    z.string().min(1, "Image url is required"),
  ]),
});

// this type is output type
// here we don't need to care about input
export type EditServerSideValidSchema = z.infer<
  typeof editServerSideValidationSchema
>;
