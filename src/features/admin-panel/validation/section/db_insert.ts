import { z } from "zod";

import { baseSchema } from "./base";

// this schema will use for only inserting data to database
// on base schema the edition is a Enum type
// which is not valid for inserting data to database
// so we use this schema to insert data to database
// here the edition is a string
const dbInsertValidationSchema = baseSchema.extend({
  edition: z.string(),
});
console.log(dbInsertValidationSchema);

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
export type DBInsertSchema = z.infer<typeof dbInsertValidationSchema>;
