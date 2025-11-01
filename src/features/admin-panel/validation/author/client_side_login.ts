import { z } from "zod";

export const clientSideLoginValidationSchema = z.object({
  email: z.string().email("Enter a valida email address"),
  password: z.string().min(8, "Password must have 8 character long"),
});

export type ClientSideLoginValidation = z.infer<
  typeof clientSideLoginValidationSchema
>;
