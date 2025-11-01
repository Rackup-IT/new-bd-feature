import { useEffect } from "react";

import { useAppSelector } from "../../../store/hooks";
import { useGetAllPostApi } from "../hooks/api/useAddPostApi";
import { DBResponseSchema } from "../validation/blog/db_response";

interface AvaiblePostOutput {
  avaiblePost: DBResponseSchema[];
  isLoading: boolean;
}

export default function useAvaiblePosts(): AvaiblePostOutput {
  const {
    mutate: getAllPostReq,
    data: allPost,
    isPending,
  } = useGetAllPostApi();

  useEffect(() => {
    getAllPostReq();
  }, [getAllPostReq]);

  const { list: sections, status: sectionStatus } = useAppSelector(
    (s) => s.secion
  );

  // Collect used post ids from whatever sections are currently in the store.
  // Don't gate showing posts on sectionStatus — if sections aren't loaded yet
  // we'll treat the used set as empty which allows all posts to be shown.
  const used = new Set(
    sections.flatMap((s) => s.posts.filter((p) => p).map((p) => p._id))
  );

  const avaiblePost = allPost ? allPost.filter((p) => !used.has(p._id!)) : [];

  return { avaiblePost, isLoading: isPending || sectionStatus === "loading" };
}
