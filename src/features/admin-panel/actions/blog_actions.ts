import slug from "slug";

import { z } from "zod"; // Import z for partial schema
import { ApiError } from "../../../lib/error";
import { getDb } from "../../../lib/mongodb";
import { DBInsertOutputSchema } from "../validation/blog/db_insert";
import {
  ServerSideOutputSchema,
  serverSideValidationSchema,
} from "../validation/blog/server_side";

const validateCreateBlogDataAction = (
  data: FormData
): ServerSideOutputSchema => {
  const rawData = Object.fromEntries(data.entries());
  const formDataObject = {
    ...rawData,
    keywords: JSON.parse(rawData.keywords as string),
    image: rawData.image,
  };
  const validationResult = serverSideValidationSchema.safeParse(formDataObject);

  if (!validationResult.success) {
    throw new ApiError(
      400,
      "Validtion Error",
      validationResult.error.flatten().fieldErrors
    );
  }

  return validationResult.data;
};

export const createPostAction = async (formData: FormData) => {
  const validatedData = validateCreateBlogDataAction(formData);
  try {
    // const imageUrl = await fileUpload(validatedData.image as File);
    // relativeImagePath = imageUrl.relativePath;

    const db = await getDb();
    const lastPostResponse = await db
      .collection("posts")
      .findOne({}, { sort: { createdAt: -1 } });
    const newIndex: number =
      lastPostResponse && "index" in lastPostResponse
        ? lastPostResponse.index + 1
        : 0;

    const newPost: DBInsertOutputSchema = {
      title: validatedData.title,
      content: validatedData.content,
      createdAt: new Date(),
      desscription: validatedData.desscription,
      edition: validatedData.edition,
      image: validatedData.image,
      keywords: JSON.stringify(validatedData.keywords),
      section: validatedData.section,
      writter: validatedData.writter,
      status: validatedData.status,
      index: newIndex,
      slug: slug(`${validatedData.title}-${newIndex}`, "-"),
    };

    const result = await db.collection("posts").insertOne(newPost);

    if (!result.insertedId) {
      throw new Error("Failed to insert post into databse.");
    }

    return result;
  } catch (ioError) {
    throw new ApiError(500, "Internal Server Error", ioError);
  }
};

export const getAllPostAction = async () => {
  try {
    const db = await getDb();
    const result = await db
      .collection("posts")
      .aggregate([
        {
          $sort: { _id: -1 },
        },

        {
          $addFields: {
            convertedSectionId: { $toObjectId: "$section" },
          },
        },

        {
          $lookup: {
            from: "sections",
            localField: "convertedSectionId",
            foreignField: "_id",
            as: "sectionData",
          },
        },

        {
          $unwind: {
            path: "$sectionData",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $addFields: {
            section: "$sectionData.title",
          },
        },

        {
          $project: {
            sectionData: 0,
            convertedSectionId: 0,
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    throw new ApiError(500, "Not able to getting all post", error);
  }
};

export const getPostById = async (slug: string, withWritterData: string) => {
  try {
    const db = await getDb();
    let result;
    // Use aggregation to lookup writer data and exclude password field
    if (withWritterData === "true") {
      result = await db
        .collection("posts")
        .aggregate([
          {
            $match: { slug: slug },
          },
          {
            $addFields: {
              convertedWritterId: { $toObjectId: "$writter" },
            },
          },
          {
            $lookup: {
              from: "authors",
              localField: "convertedWritterId",
              foreignField: "_id",
              as: "writterData",
            },
          },
          {
            $unwind: {
              path: "$writterData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: {
              writter: {
                $cond: {
                  if: { $eq: ["$writterData", null] },
                  then: "$writter", // Keep original ID if no writer found
                  else: {
                    _id: "$writterData._id",
                    name: "$writterData.name",
                    bio: "$writterData.bio",
                    email: "$writterData.email",
                    occupation: "$writterData.occupation",
                    location: "$writterData.location",
                    website: "$writterData.website",
                    isApproved: "$writterData.isApproved",
                    approvalStatus: "$writterData.approvalStatus",
                    requestedAt: "$writterData.requestedAt",
                    profileImage: "$writterData.profileImage",
                  },
                },
              },
            },
          },
          {
            $project: {
              convertedWritterId: 0,
              writterData: 0,
            },
          },
        ])
        .toArray();
    } else {
      result = await db.collection("posts").find({ slug: slug }).toArray();
    }

    if (!result || result.length === 0) {
      throw new Error("Post not found");
    }

    return result[0];
  } catch (error) {
    throw new ApiError(500, "Not able to getting post by id", error);
  }
};

// Removed validateUpdateBlogDataAction as it's no longer needed for partial updates

export const updatePostAction = async (
  slug: string,
  data: Partial<ServerSideOutputSchema>
) => {
  try {
    // Validate only the provided fields
    const validationResult = z
      .object(serverSideValidationSchema.shape)
      .partial()
      .safeParse(data);

    if (!validationResult.success) {
      throw new ApiError(
        400,
        "Validation Error",
        validationResult.error.flatten().fieldErrors
      );
    }

    const db = await getDb();
    const result = await db
      .collection("posts")
      .updateOne({ slug: slug }, { $set: validationResult.data });

    if (result.modifiedCount === 0) {
      throw new Error("Failed to update post in database.");
    }

    return result;
  } catch (error) {
    throw new ApiError(500, "Internal Server Error", error);
  }
};

export const deletePostAction = async (slug: string) => {
  try {
    const db = await getDb();
    const result = await db.collection("posts").deleteOne({ slug: slug });

    if (result.deletedCount === 0) {
      throw new Error("Failed to delete post from database.");
    }

    return result;
  } catch (error) {
    throw new ApiError(500, "Internal Server Error", error);
  }
};
