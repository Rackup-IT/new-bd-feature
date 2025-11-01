import { uploadFile } from "@/lib/storage_service";
import { ClientSideValidationSchema } from "../validation/author/client_side";

export async function prepareAuthorFormDataWithImage(
  data: ClientSideValidationSchema
): Promise<FormData> {
  let finalProfileImage: string | null = null;

  // If profileImage is a File, upload it first
  if (data.profileImage instanceof File) {
    const uploadedImage = await uploadFile(data.profileImage);
    finalProfileImage = uploadedImage.url;
  } else if (typeof data.profileImage === "string") {
    // If it's already a URL string, use it directly
    finalProfileImage = data.profileImage;
  }

  // Create FormData object for the server
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("bio", data.bio);
  formData.append("occupation", data.occupation);
  formData.append("password", data.password);

  if (data.location) {
    formData.append("location", data.location);
  }

  if (data.website) {
    formData.append("website", data.website);
  }

  if (finalProfileImage) {
    formData.append("profileImage", finalProfileImage);
  }

  return formData;
}
