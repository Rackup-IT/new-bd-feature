import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  ClientSideSchema,
  clientSideValidationSchema,
} from "../validation/section/client_side";

export function useCreateSectionForm() {
  return useForm<ClientSideSchema>({
    resolver: zodResolver(clientSideValidationSchema),
    defaultValues: {
      title: "",
      edition: "global",
      href: "",
    },
  });
}
