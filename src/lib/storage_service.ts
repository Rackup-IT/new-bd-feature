import { upload as uploadToVercelBlob } from "@vercel/blob/client";

export async function uploadFile(file: File): Promise<{ url: string }> {
  if (process.env.NEXT_PUBLIC_CLOUD_PROVIDER === "VERCEL") {
    try {
      const newBlob = await uploadToVercelBlob(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/v1/vercel-image-upload",
      });

      return { url: newBlob.url };
    } catch (error) {
      console.error("Vercel Blob upload failed:", error);
      throw new Error("File upload to Vercel failed.");
    }
  } else if (process.env.NEXT_PUBLIC_CLOUD_PROVIDER === "Firebase") {
    console.error("Firebase Storage is not yet implemented.");
    throw new Error("Firebase Storage is not configured.");
  } else {
    throw new Error("Cloud provider not supported");
  }
}
