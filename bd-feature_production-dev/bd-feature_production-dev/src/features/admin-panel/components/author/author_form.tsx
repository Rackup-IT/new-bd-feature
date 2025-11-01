"use client";
import { useRouter } from "next/navigation";

import LoadingSpinner from "@/components/loading-spinner/loading_spinner";
import { useEffect } from "react";
import {
  useCreateAuthorForm,
  useLogInAuthorForm,
} from "../../hooks/useCreateAuthorForm";
import { Input } from "../input";
import { ProfileImageInput } from "./ProfileImageInput";

interface AuthorFormProps {
  isSignUp: boolean;
}

export default function AuthorForm({ isSignUp }: AuthorFormProps) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    errors,
    onSubmitHandler,
    isPending,
    mutateError,
    signUpResult,
    profileImage,
    isUploading,
    uploadError,
    handleImageChange,
  } = useCreateAuthorForm();
  const {
    handleSubmit: logInHandler,
    register: logInRegister,
    errors: logInErrors,
    onLoginSubmitHandler,
    logInData,
    loginPending,
    logInError,
  } = useLogInAuthorForm();

  useEffect(() => {
    if (signUpResult || logInData) {
      router.replace("/dashboard");
      router.refresh();
    }
  }, [signUpResult, logInData, router]);

  if (!isSignUp) {
    return (
      <form
        onSubmit={logInHandler(onLoginSubmitHandler, (err) => console.log(err))}
        className="flex flex-col gap-4 w-[400px]"
      >
        <Input
          label="Email"
          error={logInErrors.email?.message}
          {...logInRegister("email")}
        />
        <Input
          label="Password"
          error={logInErrors.password?.message}
          {...logInRegister("password")}
        />
        {loginPending ? (
          <LoadingSpinner />
        ) : (
          <button
            type="submit"
            className="bg-black text-white font-semibold py-2 rounded-md cursor-pointer"
          >
            Log In
          </button>
        )}
        {logInError && (
          <p className="bg-red-700 text-white text-center rounded-md">
            {logInError?.message}
          </p>
        )}
      </form>
    );
  }

  // Sign Up Section
  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler, (err) => console.log(err))}
      className="flex flex-col gap-3 w-[400px]"
    >
      <ProfileImageInput
        label="Profile Image"
        error={(errors.profileImage?.message as string) || uploadError || ""}
        value={profileImage}
        onChange={handleImageChange}
        isLoading={isUploading}
      />
      <Input label="Name" error={errors.name?.message} {...register("name")} />
      <Input
        label="Email"
        error={errors.name?.message}
        {...register("email")}
      />
      <Input
        label="Occupation"
        error={errors.occupation?.message}
        {...register("occupation")}
      />
      <Input
        label="BIO"
        {...register("bio")}
        error={errors.bio?.message}
        useTextArea
      />
      <Input
        label="Location"
        error={errors.location?.message}
        {...register("location")}
      />
      <Input
        label="Website Link"
        error={errors.website?.message}
        {...register("website")}
      />
      <Input
        label="Password"
        {...register("password")}
        error={errors.password?.message}
      />
      {isPending ? (
        <LoadingSpinner />
      ) : (
        <button
          type="submit"
          className="bg-black py-2 rounded-md text-white font-semibold cursor-pointer"
        >
          Create Account
        </button>
      )}
      {mutateError && (
        <p className="text-white bg-red-700 text-center">
          {mutateError.message}
        </p>
      )}
    </form>
  );
}
