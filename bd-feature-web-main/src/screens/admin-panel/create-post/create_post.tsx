"use client";

import { useEffect, useState } from "react";

import LoadingSpinner from "@/components/loading-spinner/loading_spinner";
import Toast from "@/components/toast/toast";
import { NavigationItemProps } from "@/interfaces/navigation_item";
import clsx from "clsx";
import ErrorSnackbar from "../../../components/error-snackbar/error_snackbar";
import useHttpRequest from "../../../hooks/api/useApiRequest";
import AdminModel from "../../../interfaces/admin";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setCloseIsEditPost } from "../../../store/slices/admin";
import AddInNavigation from "../add-in-navigation/add_in_navigation";
import ImageInput from "../image-input/image_input";
import ArticleWritingEditor from "../rich-text-editor/rich_text_editor";
import SelectEdition from "../select-edition/select_edition";
import TagList from "../tag-list-comp/tag_list_comp";
import CustomTextFiled from "../text-field/text_field";

interface CreatePostProps {
  author: AdminModel;
}

const CreatePost: React.FC<CreatePostProps> = (props) => {
  const { sendRequest, data, loading } = useHttpRequest();
  const {
    sendRequest: sendCreatePostRequest,
    error: postError,
    loading: postLoading,
  } = useHttpRequest();
  const isEditPost = useAppSelector((state) => state.admin.isEditPost);
  const existingPost = useAppSelector((state) => state.admin.post);
  const dispatch = useAppDispatch();

  const [reloadNavigation, setReloadNavigation] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [hideErrorDialog, setHideErrorDialog] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  // Form Data States
  const [title, setTitle] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [edition, setEdition] = useState<string>("Global");
  const [article, setArticle] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [navigation, setNavigation] = useState<string | null>(null);
  const [thumbnailAltText, setThumbnailAltText] = useState<string>("");

  const handlePublish = async () => {
    setHideErrorDialog(false);

    const formData = new FormData();
    formData.append("title", title!);
    formData.append("thumbnail", thumbnail!);
    formData.append("thumbnailAltText", thumbnailAltText!);
    formData.append("publisherId", props.author._id);
    formData.append("publisherName", props.author.name);
    formData.append("tags", JSON.stringify(tags!));
    formData.append("edition", edition === "Global" ? "gl" : "bd");
    formData.append("onNavigation", navigation!);
    formData.append("article", article);

    try {
      if (!isEditPost) {
        await sendCreatePostRequest("/api/admin/post", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
      } else {
        await sendCreatePostRequest(
          `/api/admin/post?postId=${existingPost!._id}`,
          {
            method: "PUT",
            body: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );

        dispatch(setCloseIsEditPost());
      }
      setShowToast(true);
      setTitle("");
      setThumbnail(null);
      setThumbnailAltText("");
      setTags([]);
      setImage(null);
      setNavigation(null);
      setArticle("");
    } catch (error) {
      setHideErrorDialog(true);
      console.log(error);
    }
  };

  useEffect(() => {
    const handleLoadNavigations = async () => {
      try {
        const queryParams = new URLSearchParams({
          edition: edition === "Global" ? "gl" : "bd",
        });
        await sendRequest(`/api/admin/navigation?${queryParams}`, {
          method: "GET",
        });
      } catch (error) {
        console.log(error);
      }
    };

    handleLoadNavigations();
  }, [edition, reloadNavigation, sendRequest]);

  useEffect(() => {
    if (!title || thumbnail?.length === 0 || tags.length === 0) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }, [title, thumbnail, tags]);

  useEffect(() => {
    if (isEditPost) {
      setTitle(existingPost?.title!);
      setImage(existingPost?.thumbnail!);
      setThumbnail(existingPost?.thumbnail!);
      setThumbnailAltText(existingPost?.thumbnailAltText!);
      setTags(existingPost?.tags!);
      setEdition(existingPost?.edition === "gl" ? "Global" : "Bangladesh");
      setArticle(existingPost?.article!);
      setNavigation(existingPost?.onNavigation!);
    }
  }, [
    isEditPost,
    existingPost?.title,
    existingPost?.thumbnailAltText,
    existingPost?.thumbnail,
    existingPost?.tags,
    existingPost?.onNavigation,
    existingPost?.edition,
    existingPost?.article,
  ]);

  return (
    <>
      {postError && hideErrorDialog && (
        <ErrorSnackbar
          message={postError?.message!}
          onClose={() => setHideErrorDialog(false)}
          className="top-2 rounded-md overflow-hidden drop-shadow-lg px-2"
        />
      )}
      <Toast
        showToast={showToast}
        setShowToast={setShowToast}
        message="Post Published Successfully"
      />
      <nav className="flex w-full flex-row justify-between items-center fixed top-0 left-0 px-2 py-3 bg-slate-50 dark:bg-slate-950 drop-shadow-sm z-20">
        <h1 className="font-ralway font-semibold sm:text-lg sm:font-bold">
          Creaet New Post
        </h1>
        <button
          onClick={handlePublish}
          disabled={!isFormValid && !postLoading}
          className={clsx(
            "font-ralway text-sm px-3 sm:px-6 py-1 rounded-md bg-opacity-70 cursor-pointer transition-300",
            {
              "bg-primary-tints-600 opacity-100 dark:bg-primary-shades-600":
                isFormValid,
              "bg-gray-200 opacity-40 dark:bg-gray-800": !isFormValid,
            }
          )}
        >
          {postLoading ? (
            <LoadingSpinner className="w-5 h-5 fill-blue-800 dark:fill-blue-300" />
          ) : (
            <p className="sm:text-lg">{isEditPost ? "Update" : "Publish"}</p>
          )}
        </button>
      </nav>
      <main className="w-full min-[585px]:w-[30rem] min-[585px]:mx-auto md:w-full md:mx-0 flex flex-col items-start mt-16 px-2 md:flex-row-reverse ">
        <div className="w-full flex flex-col md:ml-5 lg:w-[45rem]">
          <CustomTextFiled
            onTextChange={(e) => setTitle(e.target.value)}
            label="Title"
            placeholder="Enter title"
            value={title!}
          />
          <ImageInput
            className="mt-4"
            onChange={(file) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => {
                if (typeof reader.result === "string")
                  setThumbnail(reader.result);
              };
            }}
            setImage={setImage}
            image={image!}
          />
          <CustomTextFiled
            onTextChange={(e) => setThumbnailAltText(e.target.value)}
            label="Thumbnail Alt Text"
            placeholder="ex. Tarantino’s Pulp Fiction shook Hollywood"
            className="mt-4"
            value={thumbnailAltText!}
          />
          <CustomTextFiled
            onTextChange={(e) => {}}
            label="Publisher Name"
            placeholder="Loading..."
            className="mt-4 opacity-50"
            value={props.author.name || ""}
            readOnly={true}
          />
          <TagList setTags={setTags} tags={tags} />
          <SelectEdition onChange={setEdition} edition={edition} />
          <AddInNavigation
            setReloadNavigation={setReloadNavigation}
            navigationList={data as NavigationItemProps[]}
            loading={loading}
            onNavigationChange={(nav) => {
              setNavigation(nav?._id!);
            }}
          />
        </div>
        <div className="w-full mt-4 md:mt-0 md:w-full">
          <label htmlFor="richtext" className="text-base font-medium">
            Write The News
          </label>
          <ArticleWritingEditor
            onChange={(e) => setArticle(e)}
            value={article!}
            className="mt-2 h-[85vh]"
          />
        </div>
      </main>
    </>
  );
};

export default CreatePost;
