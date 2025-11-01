import z from "zod";
import { baseSchema } from "./base";

export const clientSideValidationSchema = baseSchema.extend({
  email: z.string().email("must need a valid email address"),
  password: z.string().min(8, "password must be 8 character long"),
  profileImage: z
    .union([
      z.string().url().nullable(),
      z.instanceof(File).refine((file) => file.type.startsWith("image/"), {
        message: "Only image files are allowed",
      }),
      z.null(),
    ])
    .optional(),
});

export type ClientSideValidationSchema = z.infer<
  typeof clientSideValidationSchema
>;
