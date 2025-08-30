import { useApiMutation } from "../../../../hooks/useApiMutation";
import { uploadFile } from "../../../../lib/storage_service";
import { prepareFormData } from "../../from/prepareFormData";
import { ClientSideInputSchema } from "../../validation/blog/client_side";
import { DBResponseSchema } from "../../validation/blog/db_response";
import { EditSideOutputSchema } from "../../validation/blog/edit_client_side";
import { ServerSideOutputSchema } from "../../validation/blog/server_side";

interface AddPostVariables {
  data: ClientSideInputSchema;
  postType: string;
}

export const useAddPostApi = () =>
  useApiMutation<unknown, AddPostVariables>({
    url: (vars) => `/api/v1/post?type=${vars.postType}`,
    method: "post",
    prepare: async (vars) => {
      let finalImage: string | null = null;
      const { image, ...restOfData } = vars.data;

      if (image instanceof File) {
        const uplaodImage = await uploadFile(image);
        finalImage = uplaodImage.url;
      }

      const finalDataForServer: ServerSideOutputSchema = {
        ...restOfData,
        image: finalImage!,
      };
      return prepareFormData(finalDataForServer, vars.postType);
    },
    invalidateKey: ["create-post"],
  });

export const useGetAllPostApi = () =>
  useApiMutation<DBResponseSchema[]>({
    url: () => "/api/v1/post",
    method: "get",
    prepare: () => undefined,
    invalidateKey: ["post-list"],
  });

export const useFetchPostByIdApi = () =>
  useApiMutation<DBResponseSchema, { id: string }>({
    url: (vars) => `/api/v1/post/${vars.id}?writter-data=false`,
    method: "get",
    prepare: () => undefined,
    invalidateKey: ["single-post"],
  });

interface UpdatePostVariables {
  id: string;
  data: Partial<EditSideOutputSchema>;
}
export const useUpdatePostApi = () =>
  useApiMutation<unknown, UpdatePostVariables>({
    url: (vars) => `/api/v1/post/${vars.id}`,
    method: "put",
    prepare: async (vars) => {
      const { image, ...restOfData } = vars.data;
      const finalData: Partial<ServerSideOutputSchema> = { ...restOfData };

      // If an image is included, upload it first and get the URL
      if (image) {
        let finalImage: string | null = null;
        if (image instanceof File) {
          const uploadedImage = await uploadFile(image);
          finalImage = uploadedImage.url;
        } else {
          // If it's not a File, it's already a URL string
          finalImage = image as string;
        }
        finalData.image = finalImage;
      }

      // Always return a JSON object for the API
      return finalData;
    },
    invalidateKey: ["update-post"],
    onSuccess: () => {
      // Removed window.location.reload() for better UX, rely on query invalidation
    },
  });

export const useDeletePostApi = () =>
  useApiMutation<unknown, { id: string }>({
    url: (vars) => `/api/v1/post/${vars.id}`,
    method: "delete",
    prepare: () => undefined,
    invalidateKey: ["delete-post"],
  });
