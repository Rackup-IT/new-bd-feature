import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import { CustomError } from "@/utils/custom-error/custom_error";
import { ObjectId } from "mongodb";
import { connect } from "../../../../utils/database/database_helper";
import { generateSlug } from "../../../../utils/generate-slug/generate_slug";
import PostSchema from "./schema/validation";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDNARY_APISCERATE,
});

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const edition = searchParams.get("edition");
  let client;
  try {
    client = await connect();
    const db = client.db();

    const result = await db
      .collection("posts")
      .aggregate([
        {
          $sort: { createdAt: -1 },
        },
        {
          $match: { edition: edition },
        },
      ])
      .toArray();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error founded" }, { status: 500 });
  } finally {
    client?.close();
  }
};

export const POST = async (req: NextRequest) => {
  const authorization = req.headers.get("authorization") as string;
  const token = authorization.split(" ")[1];
  const formData = await req.formData();
  const formDataObj: { [key: string]: unknown } = {};
  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });
  const thumbnail = formData.get("thumbnail") as string;
  const tags = formData.get("tags") as string;
  const authorId = formDataObj.publisherId as string;
  let client;
  try {
    jwt.verify(token, process.env.SCERATE_ADMIN_KEY!);

    client = await connect();
    const db = client.db();
    const { error } = PostSchema.validate(formDataObj);
    if (error) {
      throw new CustomError("", error.message, 403);
    }

    const uploadImgResult = await cloudinary.uploader.upload(thumbnail, {
      folder: "thumbnail-images",
      unique_filename: true,
    });

    const lastPost = await db
      .collection("posts")
      .find()
      .sort({ index: -1 })
      .limit(1)
      .toArray();

    const newIndex = lastPost.length > 0 ? lastPost[0].index + 1 : 1;

    const slug = generateSlug(formDataObj.title as string, newIndex);

    const post = {
      ...formDataObj,
      tags: JSON.parse(tags),
      thumbnail: uploadImgResult.secure_url,
      index: Number(newIndex),
      slug: slug,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.collection("posts").insertOne(post);

    return NextResponse.json({ message: "succesfuuly got is" });
  } catch (error) {
    let errMsg: string = "Soemething went wrong!";
    let code: number = 500;
    if (error instanceof CustomError) {
      const parseError = JSON.parse(error.message);
      errMsg = parseError.gl;
      code = error.code!;
      console.log(errMsg);
    }
    if (error instanceof JsonWebTokenError) {
      errMsg = "your authentication toket is not valid!";
    }

    if (error instanceof TokenExpiredError) {
      errMsg = "your authentication token is expired!";
    }
    return NextResponse.json({ message: errMsg }, { status: code! });
  } finally {
    client?.close();
  }
};

export const PUT = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const postId = searchParams.get("postId");
  const authorization = req.headers.get("authorization") as string;
  const token = authorization.split(" ")[1];
  const formData = await req.formData();
  const formDataObj: { [key: string]: unknown } = {};
  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });
  const thumbnail = formData.get("thumbnail") as string;
  const tags = formData.get("tags") as string;
  const authorId = formDataObj.publisherId as string;
  let client;

  try {
    jwt.verify(token, process.env.SCERATE_ADMIN_KEY!);

    client = await connect();
    const db = client.db();
    const { error } = PostSchema.validate(formDataObj);
    if (error) {
      throw new CustomError("", error.message, 403);
    }

    let uploadImageResult: UploadApiResponse;
    if (!thumbnail.startsWith("https:")) {
      uploadImageResult = await cloudinary.uploader.upload(thumbnail, {
        folder: "thumbnail-images",
        unique_filename: true,
      });
    }

    const lastPost = await db
      .collection("posts")
      .find()
      .sort({ index: -1 })
      .limit(1)
      .toArray();

    const newIndex = lastPost.length > 0 ? lastPost[0].index + 1 : 1;

    const slug = generateSlug(formDataObj.title as string, newIndex);

    const post = {
      ...formDataObj,
      tags: JSON.parse(tags),
      thumbnail: thumbnail.startsWith("https:")
        ? thumbnail
        : uploadImageResult!.secure_url,
      index: Number(newIndex),
      slug: slug,
      updatedAt: Date.now(),
    };

    await db
      .collection("posts")
      .findOneAndUpdate({ _id: new ObjectId(postId!) }, { $set: post });
    return NextResponse.json({ message: "Post succesfully updated!" });
  } catch (error) {
    let errMsg: string = "Soemething went wrong!";
    let code: number = 500;
    if (error instanceof CustomError) {
      const parseError = JSON.parse(error.message);
      errMsg = parseError.gl;
      code = error.code!;
      console.log(errMsg);
    }
    if (error instanceof JsonWebTokenError) {
      errMsg = "your authentication toket is not valid!";
    }

    if (error instanceof TokenExpiredError) {
      errMsg = "your authentication token is expired!";
    }
    return NextResponse.json({ message: errMsg }, { status: code! });
  } finally {
    client?.close();
  }
};

export const DELETE = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const postId = searchParams.get("id");
  let client;

  try {
    client = await connect();
    const db = client.db();
    await db.collection("posts").deleteOne({ _id: new ObjectId(postId!) });

    return NextResponse.json("Post Deleteed Succesfully", { status: 200 });
  } catch (error) {
    let errMsg: string =
      "Not able to delete post right now! please try again later";
    let code: number = 500;
    return NextResponse.json({ message: errMsg }, { status: code });
  } finally {
    client?.close();
  }
};
