import { ClientSideValidationSchema } from "../validation/author/client_side";

export function prepareAuthorFormData(
  data: ClientSideValidationSchema
): FormData {
  const fd = new FormData();
  fd.append("name", data.name);
  fd.append("email", data.email);
  fd.append("bio", data.bio);
  fd.append("occupation", data.occupation);
  fd.append("password", data.password);
  fd.append("location", data.location || "");
  fd.append("website", data.website || "");

  // Add profileImage if it exists
  if (data.profileImage) {
    fd.append("profileImage", data.profileImage);
  }

  return fd;
}
