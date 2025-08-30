"use client";

import LoadingSpinner from "@/components/loading-spinner/loading_spinner";
import { closeModalOverlay } from "@/store/slice/modal_overlay_slice";
import { useCallback, useEffect } from "react";
import Dialog from "../../../components/overlay/merge_modal";
import { editionOptions } from "../../../data/edition_data";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  useAddSectionApi,
  useUpdateSectionApi,
} from "../hooks/api/useSectionApi";
import { useCreateSectionForm } from "../hooks/useCreateSectionForm";
import { ClientSideSchema } from "../validation/section/client_side";
import { Input } from "./input";
import { Select } from "./input/select";

const AddSectionDialog = () => {
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useCreateSectionForm();
  const {
    mutate,
    isPending,
    isSuccess: addSuccess,
    error: addError,
  } = useAddSectionApi();
  const {
    mutate: mutateUpdate,
    isPending: updatePending,
    error: updateError,
    isSuccess: updateSuccess,
  } = useUpdateSectionApi();
  const dispatch = useAppDispatch();
  const { isOpen, sectionToEdit } = useAppSelector(
    (state) => state["model-overlay"]
  );
  const isEditMode = !!sectionToEdit;

  const onSubmit = (data: ClientSideSchema) => {
    if (isEditMode) {
      mutateUpdate({ id: sectionToEdit._id as string, data });
    } else {
      mutate(data);
    }
  };

  const onCancel = useCallback(() => {
    reset();
    dispatch(closeModalOverlay());
  }, [dispatch, reset]);

  useEffect(() => {
    if (addSuccess || updateSuccess) {
      onCancel();
    }
  }, [addSuccess, updateSuccess, onCancel]);

  useEffect(() => {
    if (isEditMode) {
      reset(sectionToEdit);
    } else {
      reset();
    }
  }, [isOpen, sectionToEdit, isEditMode, reset]);

  const isLoading = isSubmitting || isPending || updatePending;
  const apiError = addError || updateError;

  return (
    <Dialog
      className="bg-white w-[400px] rounded-md p-2"
      closeOnOutsideClick={true}
    >
      <form
        onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
        className="w-full space-y-4"
      >
        <h2>Add New Section</h2>
        <Input
          label="Title"
          error={errors.title?.message}
          {...register("title")}
        />

        <Select
          label="Edition"
          options={editionOptions}
          error={errors.edition?.message}
          {...register("edition")}
        />
        <Input
          label="Href"
          error={errors.href?.message}
          {...register("href")}
        />
        {apiError && (
          <div className="w-full bg-red-300 px-1 py-1 rounded-md">
            {apiError.message}
          </div>
        )}

        {!isLoading ? (
          <div className="w-full flex space-x-4 mt-6">
            <button
              onClick={onCancel}
              type="button"
              className="bg-red-300 px-2 rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-300 px-2 rounded-md cursor-pointer"
            >
              {isEditMode ? "Update" : "Save"}
            </button>
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </form>
    </Dialog>
  );
};

export default AddSectionDialog;
