import { z } from "zod";

import { baseSchema } from "./base";

// becase this is response schema
// we just extend it with _id field
// so we can get the data properly from mongdb database
export const dbResponseVlidationSchema = baseSchema.extend({
  _id: z.string().optional(),
});

// this schema is not for validating data
// its only for getting data from database
// use this one like other interface/model
// because we can't use this as a validaiton
// so its not metter we take input/output
// but for consistency we write the name as output & also get the OUTPUT
// for safty
export type DBResponseSchema = z.infer<typeof dbResponseVlidationSchema>;
