import { z } from "zod";

import { baseSchema } from "./base";

// there is no change/extend needed becase the base schema is enough
// to handle the client side data
export const clientSideValidationSchema = baseSchema.extend({});

// one base schema
// we can't do any data transform or preprocessing
// so we do not need to care about input/output
// but for the project consistecny & best practice
// we export the output schema type

export type ClientSideSchema = z.infer<typeof clientSideValidationSchema>;
