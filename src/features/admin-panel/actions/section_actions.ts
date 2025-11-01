import { ApiError } from "@/lib/error";
import { InsertOneResult, ObjectId } from "mongodb";
import { getDb } from "../../../lib/mongodb";
import { clientSideValidationSchema } from "../validation/section/client_side";
import { DBInsertSchema } from "../validation/section/db_insert";

const sectionValidationAction = (formData: FormData) => {
  const rawData = Object.fromEntries(formData.entries());
  const validationResult = clientSideValidationSchema.safeParse(rawData);
  if (!validationResult.success) {
    throw new ApiError(
      400,
      "Validation error",
      validationResult.error.flatten().fieldErrors
    );
  }

  return validationResult.data;
};

export const addSectionAction = async (
  formData: FormData
): Promise<InsertOneResult<Document>> => {
  const validatedData = sectionValidationAction(formData);
  try {
    const newSection: DBInsertSchema = {
      title: validatedData.title,
      edition: validatedData.edition,
      href: validatedData.href,
    };
    const db = await getDb();
    const result = await db.collection("sections").insertOne(newSection);

    if (!result.insertedId) {
      throw new Error("Failed to insert section into database.");
    }

    return result;
  } catch (ioError) {
    throw new ApiError(500, "Database insert error", ioError);
  }
};

export const getAllSectionsAction = async () => {
  try {
    const db = await getDb();
    const result = await db
      .collection("sections")
      .find()
      .sort({ _id: -1 })
      .toArray();
    return result;
  } catch (error) {
    throw new ApiError(500, "Database read error", error);
  }
};

export const deleteSectionAction = async (sectionId: string) => {
  try {
    const db = await getDb();
    const result = await db
      .collection("sections")
      .deleteOne({ _id: new ObjectId(sectionId) });

    if (result.deletedCount === 0) {
      throw new Error("Failed to delete section from database.");
    }

    return result.deletedCount;
  } catch (ioError) {
    throw new ApiError(500, "Database delete error", ioError);
  }
};

export const updateSectionAction = async (
  sectionId: string,
  formData: FormData
) => {
  const validatedData = sectionValidationAction(formData);
  try {
    console.log("sectionId", sectionId);
    const db = await getDb();
    const result = await db
      .collection("sections")
      .updateOne({ _id: new ObjectId(sectionId) }, { $set: validatedData });

    if (result.modifiedCount === 0) {
      throw new Error("Failed to update section in database.");
    }

    return result;
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Database update error", error);
  }
};
