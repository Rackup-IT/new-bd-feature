import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  ClientSideInputSchema,
  clientSideValidationSchema,
} from "../validation/blog/client_side";
import {
  EditSideOutputSchema,
  editClientSideValidationSchema,
} from "../validation/blog/edit_client_side";
import {
  useAddPostApi,
  useFetchPostByIdApi,
  useUpdatePostApi,
} from "./api/useAddPostApi";
import { useGetSectionsApi } from "./api/useSectionApi";

export function useCreateBlogForm(editId: string | null) {
  const isEditing = !!editId;
  const currentValidationSchema = isEditing
    ? editClientSideValidationSchema
    : clientSideValidationSchema;

  // this hook responsible for :
  // set form datas
  // handle the form submission
  // handle the form reset
  // handle form client side error
  // also form submitting states
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ClientSideInputSchema | EditSideOutputSchema>({
    resolver: zodResolver(currentValidationSchema),
  });

  // this custom hook is reponsive for :
  // crate new post
  // upload the post into the database
  const {
    mutate: addPostReq,
    isSuccess,
    error: apiError,
    isError,
    isPending,
  } = useAddPostApi();

  // this custom hook is reponsive for :
  // fetch all avaible section as list
  // show them inside the form (Section Field)
  const {
    mutate: getAllSection,
    data: allsection,
    isPending: sectionPending,
  } = useGetSectionsApi();

  // this custom hook is reponsive for :
  // fetching the current edited post based on id
  // that we getting from the url
  const { mutate: getPostByIdReq, data: singlePost } = useFetchPostByIdApi();

  const {
    mutate: updatePostReq,
    isPending: updatePending,
    isSuccess: updateSuccess,
  } = useUpdatePostApi();

  // This function is responsible for :
  // submit the form to backend by getting help of
  // useAddPostApi hook
  const onSubmitHandler = async (
    data: ClientSideInputSchema | EditSideOutputSchema,
    postType: "published" | "draft"
  ) => {
    if (isEditing && singlePost) {
      updatePostReq({ data: data as EditSideOutputSchema, id: editId });
    } else {
      addPostReq({ data, postType });
    }
  };

  // this side effect is responsible for :
  // useMemo use when you need calculate something & store it in cache
  // here we filter all sections & return them into a new object.
  // why?
  // because our Select component is design on this shape of object/data.
  // after converting we cache the data
  // so for second internet call we will get the data from cache
  const sectionOptions = useMemo(() => {
    if (!allsection) {
      return [];
    }

    return allsection.map((section) => ({
      value: section._id as string,
      label: section.title,
    }));
  }, [allsection]);

  // this side effect is responsible for :
  // clear the form after the post is created
  // its will call when the api request is success
  // which we can get by the "isSuccess" variable
  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess, reset, updateSuccess]);

  // this side effect is responsible for :
  // fetch all sections from the database
  // its will call when the component is mounted
  // by help of this hook : useGetSectionsApi()
  useEffect(() => {
    if (isEditing) getPostByIdReq({ id: editId });
    getAllSection();
  }, [getAllSection, isEditing, getPostByIdReq, editId]);

  // To show the data on the form without getting any error
  // for that we need to handle the keywords field & image
  // bcease the keyword on client side is string[] & image is File
  // but we get keywords as string & image also string
  // so we need to convert them into array & image will be undifined
  useEffect(() => {
    if (isEditing && singlePost) {
      let keywords: string[] = [];
      if (singlePost.keywords) {
        if (Array.isArray(singlePost.keywords)) {
          keywords = singlePost.keywords;
        } else if (typeof singlePost.keywords === "string") {
          try {
            keywords = JSON.parse(singlePost.keywords);
          } catch {
            keywords = singlePost.keywords.split(",").map((kw) => kw.trim());
          }
        }
      }

      const editableData = {
        ...singlePost,
        keywords,
      };
      reset(editableData);
    }
  }, [isEditing, singlePost, reset, updateSuccess]);

  return {
    // Form states & methods
    register,
    handleSubmit,
    control,
    errors,
    isSubmitting,
    reset,
    onSubmitHandler,
    setValue,
    // UI data & states
    isError,
    isUploading: isPending || updatePending,
    isFetchingSection: sectionPending,
    sectionOptions,
    allsection,
    // Snakbar states
    isSuccess,
    apiError,
  };
}
