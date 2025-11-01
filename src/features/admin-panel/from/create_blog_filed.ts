import { ClientSideInputSchema } from "../validation/blog/client_side";

export const textFileds: Array<{
  name: keyof ClientSideInputSchema;
  label: string;
  placeholder: string;
}> = [
  {
    name: "title",
    label: "Title",
    placeholder: "Enter title",
  },
  {
    name: "section",
    label: "Section",
    placeholder: "Enter section",
  },
  {
    name: "writter",
    label: "Writter",
    placeholder: "Writter name",
  },
  {
    name: "edition",
    label: "Edition",
    placeholder: "Enter Edition",
  },
  {
    name: "desscription",
    label: "Description",
    placeholder: "Enter Description",
  },
];
