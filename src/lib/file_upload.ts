import { mkdir, stat, writeFile } from "fs/promises";
import path from "path";

interface FsError extends Error {
  code: string;
}

// A simple map to convert MIME types to file extensions
const mimeTypeToExt: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
  "video/mp4": ".mp4",
  // Add other MIME types you expect to handle
};

/**
 * Uploads a file to the server's public directory.
 * @param file The file to upload, received from FormData.
 * @param subfolder An optional subfolder within /public to store the file (e.g., "avatars", "posts"). Defaults to "uploads".
 * @returns A promise that resolves to the public URL of the uploaded file.
 * @throws An error if the upload fails.
 */

interface FileUploadResponse {
  relativePath: string;
  absolutePath: string;
}

export async function fileUpload(
  file: File,
  subFolder: string = "uploads"
): Promise<FileUploadResponse> {
  const byte = await file.arrayBuffer();
  const buffer = Buffer.from(byte);

  const uploadDir = path.join(process.cwd(), "public", subFolder);

  try {
    await stat(uploadDir);
  } catch (error) {
    const fsError = error as FsError;
    if (fsError.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error("Error checking directory:", error);
      throw new Error("Could not create upload directory");
    }
  }

  let extension = path.extname(file.name);

  if (!extension) {
    extension = mimeTypeToExt[file.type] || "";
  }

  if (!extension) {
    throw new Error(
      `File has no extension and its type "${file.type}" is not supported.`
    );
  }

  const baseName = path.basename(file.name, extension);
  const uniqueFileName = `${Date.now()}-${baseName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")}${extension}`;
  const filePath = path.join(uploadDir, uniqueFileName);

  try {
    await writeFile(filePath, buffer);
  } catch (error) {
    console.error("Error writing file:", error);
    throw new Error("Failed to save the file.");
  }

  const imageUrl = `/${subFolder}/${uniqueFileName}`;
  return { relativePath: imageUrl, absolutePath: filePath };
}
