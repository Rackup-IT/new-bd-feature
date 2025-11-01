import { PostResponseModel } from "../features/admin-panel/types/type";

export const DUMMY_POSTS: PostResponseModel[] = [
  {
    id: "01",
    title:
      "Title 1 This is the description This is the description This is the description This is the description This is the description This is the descriptionThis is the description",
    desscription: "This is the description",
    edition: "Global",
    writter: "Sayem Mohaimin",
    section: "Section 01",
    keywords: ["Keyword 1", "Keyword 2", "Keyword 3"],
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    content: "This is the content of the post",
    status: "Draft",
  },
];

export default DUMMY_POSTS;
