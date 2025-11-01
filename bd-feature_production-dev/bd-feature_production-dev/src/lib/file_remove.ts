import { promises as fs } from "fs";
import path from "path";
import { ApiError } from "./error";

export const removeFile = async (fileUrl: string): Promise<void> => {
  if (!fileUrl || typeof fileUrl !== "string") {
    return;
  }

  try {
    const filePath = path.join(process.cwd(), "public", fileUrl);
    await fs.unlink(filePath);
  } catch (error) {
    throw new ApiError(500, "Not able to delete the file", error);
  }
};
