import { z } from "zod";

import { baseSchema, imagePreprocess } from "./base";

// first image use the `imagePreprocess` from the base schema
// the job of this preprocessing is to return the File type if you give it a file
// otherwise it return other type of data
// after the image preprocessing is done, its return data to us
// now with union we check is the data we get is a File or String (both are acceptable)
// lasly we make it optional becase user can leave the image field empty
// if empty then we use the old image url
export const editClientSideValidationSchema = baseSchema.extend({
  image: imagePreprocess.pipe(
    z
      .union([
        z.instanceof(File, { message: "A image is required!" }),
        z.string().min(1, "Image url is required"),
      ])
      .optional()
  ),
});

// here we get the output type, why?
// our goal is that user can :
//select new image File
// or live it empty
// so if we use the input type then we get the image filed is a unknown type becase of preprocessing
// that not we want -> our goal is the image filed is a File or string type
// so the output type is what we want
// export type EditSideInputSchema = z.input<typeof editSideValidationSchema>;
export type EditSideOutputSchema = z.infer<
  typeof editClientSideValidationSchema
>;
