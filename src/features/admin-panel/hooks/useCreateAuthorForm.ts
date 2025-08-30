import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useCreateAuthorApi, useLogInAuthorApi } from "./api/useAuthorApi";

import {
  clientSideValidationSchema,
  ClientSideValidationSchema,
} from "../validation/author/client_side";
import {
  ClientSideLoginValidation,
  clientSideLoginValidationSchema,
} from "../validation/author/client_side_login";

export function useCreateAuthorForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    setValue,
    watch,
  } = useForm<ClientSideValidationSchema>({
    resolver: zodResolver(clientSideValidationSchema),
    defaultValues: {
      profileImage: null,
    },
  });

  const { mutate, isPending, error, data } = useCreateAuthorApi();

  const handleImageChange = async (file: File | null) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      if (file) {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          setUploadError("Image size must be less than 5MB");
          setValue("profileImage", null);
          return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          setUploadError("Only image files are allowed");
          setValue("profileImage", null);
          return;
        }

        // Set the file in the form
        setValue("profileImage", file);
      } else {
        // Clear the image
        setValue("profileImage", null);
      }
    } catch {
      setUploadError("Error processing image");
      setValue("profileImage", null);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmitHandler = (data: ClientSideValidationSchema) => {
    // The prepare function in useCreateAuthorApi will handle the image upload
    mutate(data);
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmitHandler,
    isPending: isPending || isUploading,
    mutateError: error,
    signUpResult: data,
    control,
    reset,
    profileImage: watch("profileImage"),
    isUploading,
    uploadError,
    handleImageChange,
  };
}

export function useLogInAuthorForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientSideLoginValidation>({
    resolver: zodResolver(clientSideLoginValidationSchema),
  });

  const { mutate, data, isPending, error } = useLogInAuthorApi();

  const onLoginSubmitHandler = (data: ClientSideLoginValidation) => {
    mutate(data);
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onLoginSubmitHandler,
    logInData: data,
    loginPending: isPending,
    logInError: error,
  };
}
