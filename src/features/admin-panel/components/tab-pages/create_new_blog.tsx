"use client";
import dynamic from "next/dynamic";
import { Controller } from "react-hook-form";

import LoadingSpinner from "@/components/loading-spinner/loading_spinner";
import SnackBar from "@/components/snackbar/snackbar";
import { cn } from "@/utils/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { editionOptions } from "../../../../data/edition_data";
import { useCreateBlogForm } from "../../hooks/useCreateBlogForm";
import { FileInput } from "../file_input";
import { Input } from "../input";
import { Select } from "../input/select";

interface SessionData {
  userId: string;
  email: string;
  name: string;
}

const TextEditor = dynamic(
  () => import("../../../../components/rich-text-editor/rich_editor"),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
);

const CreateNewBlog = () => {
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");

  const {
    register,
    control,
    errors,
    onSubmitHandler,
    handleSubmit,
    isSubmitting,
    isFetchingSection,
    sectionOptions,
    allsection,
    isError,
    isSuccess,
    apiError,
    isUploading,
    setValue,
  } = useCreateBlogForm(editId!);

  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/v1/session");
        const data = await response.json();
        setSession(data.session);
        if (data.session?.userId) {
          setValue("writter", data.session.userId, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [setValue]);

  useEffect(() => {
    if (session?.userId) {
      setValue("writter", session.userId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [session, setValue]);

  return (
    <div className="relative h-full">
      <form
        onSubmit={handleSubmit(
          (data) => {
            onSubmitHandler(data, "published");
          },
          (err) => console.log(err)
        )}
        className="grid grid-rows-[auto_1fr] h-full min-h-0"
      >
        {isUploading ? (
          <div className="w-full flex justify-end">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="w-full space-x-2 flex justify-end">
            {!editId && (
              <button
                onClick={handleSubmit(
                  (data) => onSubmitHandler(data, "draft"),
                  (err) => console.log(err)
                )}
                className="bg-gray-300 cursor-pointer px-3 py-1 rounded-md"
                type="button"
                disabled={isSubmitting}
              >
                Draft
              </button>
            )}

            <button
              className="bg-green-300 cursor-pointer px-3 py-1 rounded-md"
              type="submit"
              disabled={isSubmitting}
            >
              {editId ? "Update" : "Publish"}
            </button>
          </div>
        )}

        <div className="grid grid-cols-[3fr_2fr] h-full min-h-0 gap-6">
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <div className="h-full min-h-0 flex flex-col">
                <TextEditor
                  onEditorChange={field.onChange}
                  value={field.value}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm">
                    {errors.content.message?.toString()}
                  </p>
                )}
              </div>
            )}
          />

          <div className="flex flex-col space-y-4 overflow-auto">
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <FileInput
                  onChange={field.onChange}
                  error={errors.image?.message?.toString()}
                />
              )}
            />
            <Input
              label="Title"
              error={errors.title?.message?.toString()}
              {...register("title")}
            />
            {isFetchingSection || !allsection ? (
              <p>Loading Section...</p>
            ) : (
              <Select
                label="Section"
                options={sectionOptions}
                error={errors.section?.message?.toString()}
                {...register("section")}
                placeholder="Select One"
              />
            )}
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {/* Hidden field to store the userId */}
                <input
                  type="hidden"
                  {...register("writter", {
                    required: "Writter is required",
                  })}
                />
                {/* Display field showing name */}
                <Input
                  label="Writter"
                  readOnly
                  error={errors.writter?.message?.toString()}
                  value={session?.name}
                />
              </>
            )}

            <Select
              label="Edition"
              options={editionOptions}
              error={errors.edition?.message?.toString()}
              {...register("edition")}
              placeholder="Select One"
            />
            <Input
              label="Description"
              error={errors.desscription?.message?.toString()}
              {...register("desscription")}
            />

            <Controller
              name="keywords"
              control={control}
              render={({ field }) =>
                (() => {
                  const displayValue = Array.isArray(field.value)
                    ? field.value.join(", ")
                    : typeof field.value === "string"
                    ? field.value
                    : "";

                  return (
                    <Input
                      label="Keywords"
                      placeholder="comma, separated"
                      value={displayValue}
                      onChange={(e) => {
                        const raw = e.target.value || "";
                        const trimmed = raw.trim();
                        const arr =
                          trimmed === ""
                            ? []
                            : raw.split(",").map((kw) => kw.trim());
                        field.onChange(arr);
                      }}
                      error={errors.keywords?.message?.toString()}
                    />
                  );
                })()
              }
            />
          </div>
        </div>
      </form>
      {(isSuccess || isError) && (
        <SnackBar
          message={isSuccess ? "Post Created ✔" : apiError?.message || "Error"}
          className={cn(isError ? "bg-red-300" : "bg-green-300")}
          duration={isError ? 4000 : 2000}
        />
      )}
    </div>
  );
};

export default CreateNewBlog;
