import { ServerSideOutputSchema } from "../validation/blog/server_side";

export async function prepareFormData(
  data: Partial<ServerSideOutputSchema>,
  postType?: string
): Promise<FormData> {
  const fd = new FormData();

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key as keyof Partial<ServerSideOutputSchema>];
      if (value !== undefined) {
        if (key === "keywords") {
          fd.append(key, JSON.stringify(value));
        } else if (key === "status" && postType) {
          fd.append(key, postType);
        } else {
          fd.append(key, value as string | Blob);
        }
      }
    }
  }

  return fd;
}
