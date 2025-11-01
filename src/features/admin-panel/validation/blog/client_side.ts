import { z } from "zod";

import { baseSchema, imagePreprocess } from "./base";

export const clientSideValidationSchema = baseSchema.extend({
  image: imagePreprocess.pipe(
    z.instanceof(File, { message: "A image is required!" })
  ),
});

// becase the `imagePreprocess` have the z.preprocess() function
// so it will return two types of data
// one is File (output type) and the other is Unknown(input type)
// input -> image : unknown
// output -> image : File
export type ClientSideInputSchema = z.input<typeof clientSideValidationSchema>; // here the image will be of type unknown
export type ClientSideOutputSchema = z.infer<typeof clientSideValidationSchema>; // here the image will be of type File
