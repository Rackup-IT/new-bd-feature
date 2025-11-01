import { ClientSideSchema } from "../validation/section/client_side";

export function prepareSectionFormData(data: ClientSideSchema) {
  const fd = new FormData();
  fd.append("title", data.title);
  fd.append("edition", data.edition);
  fd.append("href", data.href);
  return fd;
}
