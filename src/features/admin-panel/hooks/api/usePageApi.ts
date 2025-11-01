import { Section } from "@/store/slice/section_slice";
import { useApiMutation } from "../../../../hooks/useApiMutation";

export const useUploadPageApi = () =>
  useApiMutation<void, unknown>({
    method: "post",
    url: () => "/api/v1/page",
    prepare: (data) => data,
    invalidateKey: ["page-list"],
  });

export interface PageResponseType {
  _id?: string;
  title: string;
  navLink: string;
  edition: string;
  sections: Section[];
}
export const useGetPageApi = (edition: string, navLink: string) =>
  useApiMutation<PageResponseType>({
    method: "get",
    url: () => `/api/v1/page?edition=${edition}&navLink=${navLink}`,
    prepare: () => undefined,
    invalidateKey: ["single-page"],
  });
