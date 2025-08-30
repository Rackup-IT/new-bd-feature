import { useApiMutation } from "../../../../hooks/useApiMutation";
import { ClientSideValidationSchema } from "../../validation/author/client_side";

import { prepareAuthorFormDataWithImage } from "../../from/prepareAuthorFormDataWithImage";

export const useCreateAuthorApi = () =>
  useApiMutation<unknown, ClientSideValidationSchema>({
    method: "post",
    prepare: prepareAuthorFormDataWithImage,
    url: () => "/api/v1/author",
    invalidateKey: ["become-author"],
  });

interface LogInAuthorApiProps {
  email: string;
  password: string;
}
export const useLogInAuthorApi = () =>
  useApiMutation<unknown, LogInAuthorApiProps>({
    method: "get",
    prepare: () => undefined,
    url: (vars) =>
      `/api/v1/author?email=${vars.email}&password=${vars.password}`,
    invalidateKey: ["log-in-author"],
  });

export const useGetSessionApi = () =>
  useApiMutation<{ session: { userId: string } }>({
    method: "get",
    prepare: () => undefined,
    url: () => "/api/v1/session",
    invalidateKey: ["get-session"],
  });

export const useGetAuthorApi = () =>
  useApiMutation<ClientSideValidationSchema, { id: string }>({
    method: "get",
    prepare: () => undefined,
    url: (vars) => `/api/v1/author/${vars.id}`,
    invalidateKey: ["get-author"],
  });

export const useUpdateAuthorApi = () =>
  useApiMutation<unknown, { id: string; data: ClientSideValidationSchema }>({
    method: "put",
    prepare: (vars) => vars.data, // Send data directly as JSON
    url: (vars) => `/api/v1/author/${vars.id}`,
    invalidateKey: ["update-author"],
  });
