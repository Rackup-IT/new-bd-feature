import { z } from "zod";

import { baseSchema } from "./base";

// we can't export this validation schema
// becase for now we can't validation anything
//with this
const dbInsertSchema = baseSchema.extend({
  image: z.string().min(1, "Image is required"),
  keywords: z.string().min(1, "Keywords is required"),
  createdAt: z.date({ message: "createdAt is required" }),
  slug: z.string().min(1, "slug is required"),
  index: z.number({ message: "index in required" }),
});
console.log(dbInsertSchema);
// this schema will use for only inserting data to database
// how?
// example we crate a new post -> const newpost = {}
// this is not efficent becase we can't get any autosuggestion
// about our fileds
// so we use this schema to get auto sugesstion about our fields
// like : const newPost:ThisSchema = {}
// Lastly
// becase we can't use its for validation so we don't care about its input/output
// but for consistency we write the name as output

export type DBInsertOutputSchema = z.infer<typeof dbInsertSchema>;
