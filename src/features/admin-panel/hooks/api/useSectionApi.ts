import { unknown } from "zod/v4-mini";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import { prepareSectionFormData } from "../../from/prepareSectionFormData";
import { ClientSideSchema } from "../../validation/section/client_side";
import { DBResponseSchema } from "../../validation/section/db_response";

export const useAddSectionApi = () =>
  useApiMutation<DBResponseSchema, ClientSideSchema>({
    method: "post",
    url: () => `/api/v1/section`,
    prepare: (data) => prepareSectionFormData(data),
    invalidateKey: ["create-section"],
  });

export const useGetSectionsApi = () =>
  useApiMutation<DBResponseSchema[]>({
    method: "get",
    url: () => `/api/v1/section`,
    prepare: () => unknown,
    invalidateKey: ["section-list"],
  });

export const useDeleteSectionApi = () =>
  useApiMutation<unknown, string>({
    method: "delete",
    url: (id) => `/api/v1/section?sectionId=${id}`,
    prepare: () => unknown,
    invalidateKey: ["section-list"],
  });

interface UpdateSectionVariables {
  id: string;
  data: ClientSideSchema;
}
export const useUpdateSectionApi = () =>
  useApiMutation<DBResponseSchema, UpdateSectionVariables>({
    method: "put",
    url: (vars) => `/api/v1/section?sectionId=${vars.id}`,
    prepare: (vars) => prepareSectionFormData(vars.data),
    invalidateKey: ["section-list"],
  });
