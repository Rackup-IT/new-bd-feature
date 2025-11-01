'use client';

import { uploadFile } from '@/lib/storage_service';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import {
  useGetAuthorApi,
  useGetSessionApi,
  useUpdateAuthorApi,
} from '../../hooks/api/useAuthorApi';
import { useCreateAuthorForm } from '../../hooks/useCreateAuthorForm';
import { ClientSideValidationSchema } from '../../validation/author/client_side';
import { FileInput } from '../file_input';
import { Input } from '../input';

/**
 * Account Component - User profile management with enhanced image preview
 *
 * Features:
 * - Robust image preview with loading and error states
 * - Support for both local paths and remote URLs
 * - Image caching to avoid redundant fetches
 * - Graceful fallback for missing/broken images
 * - Maintains all existing form functionality
 * - Proper handling of profile image uploads with type validation
 */
const Account: React.FC = () => {
  // Get form methods with proper typing
  const formMethods = useCreateAuthorForm();
  const { register, handleSubmit, errors, isPending, control, reset, handleImageChange } =
    formMethods;

  const { mutate: getSession, data: session } = useGetSessionApi();
  const { mutate: getAuthor, data: author } = useGetAuthorApi();
  const { mutate: updateAuthor, isPending: isUpdating } = useUpdateAuthorApi();

  // State for image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [logoutPending, setLogoutPending] = useState<boolean>(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const router = useRouter();

  // Cache for image URLs to avoid redundant fetches
  const imageCache = useRef<Record<string, string>>({});

  /**
   * Generates a preview URL for the profile image
   * Handles both local File objects and remote URLs
   *
   * @param image - File object, URL string, or null/undefined
   */
  const generateImagePreview = useCallback((image: File | string | null | undefined) => {
    if (!image) {
      setImagePreview(null);
      return;
    }

    // Handle File object (new upload)
    if (image instanceof File) {
      const previewUrl = URL.createObjectURL(image);
      setImagePreview(previewUrl);
      return;
    }

    // Handle string URL (existing image)
    if (typeof image === 'string') {
      // Check cache first
      if (imageCache.current[image]) {
        setImagePreview(imageCache.current[image]);
        return;
      }

      // For remote URLs, use directly
      if (image.startsWith('http://') || image.startsWith('https://')) {
        setImageLoading(true);
        setImageError(false);
        setImagePreview(image);
        // Cache the URL
        imageCache.current[image] = image;
        setImageLoading(false);
        return;
      }

      // For local paths, construct full URL
      try {
        const fullUrl = new URL(image, window.location.origin).toString();
        setImageLoading(true);
        setImageError(false);
        setImagePreview(fullUrl);
        // Cache the constructed URL
        imageCache.current[image] = fullUrl;
      } catch (err) {
        console.error('Error constructing image URL:', err);
        setImageError(true);
      } finally {
        setImageLoading(false);
      }
    }
  }, []);

  /**
   * Handles file selection and validation
   * Uses the hook's handleImageChange for proper form state management
   */
  const handleFileChange = useCallback(
    async (files: FileList | null) => {
      setIsUploading(true);
      setUploadError(null);

      try {
        if (files && files.length > 0) {
          const file = files[0];

          // Validate file type
          if (!file.type.startsWith('image/')) {
            setUploadError('Only image files are allowed');
            await handleImageChange(null);
            return;
          }

          // Validate file size (5MB max)
          if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image size must be less than 5MB');
            await handleImageChange(null);
            return;
          }

          // Use the hook's handleImageChange to properly set the file in form state
          await handleImageChange(file);

          // Generate preview
          generateImagePreview(file);
        } else {
          // Clear the image
          await handleImageChange(null);
          setImagePreview(null);
        }
      } catch {
        setUploadError('Error processing image');
        await handleImageChange(null);
      } finally {
        setIsUploading(false);
      }
    },
    [generateImagePreview, handleImageChange],
  );

  /**
   * Prepares form data for submission
   * Handles image upload to storage service if needed
   */
  const prepareFormData = useCallback(async (data: ClientSideValidationSchema) => {
    let finalProfileImage: string | null = null;

    // If profileImage is a File, upload it first
    if (data.profileImage instanceof File) {
      setIsUploading(true);
      try {
        const uploadedImage = await uploadFile(data.profileImage);
        finalProfileImage = uploadedImage.url;
        console.log('Image uploaded to:', finalProfileImage);
      } catch (err) {
        console.error('Error uploading image:', err);
        setUploadError('Failed to upload image');
        throw err;
      } finally {
        setIsUploading(false);
      }
    } else if (typeof data.profileImage === 'string') {
      // If it's already a URL string, use it directly
      finalProfileImage = data.profileImage;
    }

    // Create the data object for submission
    const submissionData = {
      ...data,
      profileImage: finalProfileImage,
    };

    console.log('Submitting payload:', {
      profileImage: typeof submissionData.profileImage,
      value: submissionData.profileImage,
    });

    return submissionData;
  }, []);

  // Initialize image preview when author data loads
  useEffect(() => {
    if (author?.profileImage) {
      generateImagePreview(author.profileImage);
    } else {
      setImagePreview(null);
    }
  }, [author?.profileImage, generateImagePreview]);

  useEffect(() => {
    getSession();
  }, [getSession]);

  useEffect(() => {
    if (session?.session) {
      getAuthor({ id: session.session.userId });
    }
  }, [session, getAuthor]);

  useEffect(() => {
    if (author) {
      reset(author);
    }
  }, [author, reset]);

  /**
   * Handles form submission with proper image processing
   */
  const onUpdateHandler = useCallback(
    async (data: ClientSideValidationSchema) => {
      try {
        if (session?.session) {
          // Prepare the data with proper image handling
          const processedData = await prepareFormData(data);
          updateAuthor({ id: session.session.userId, data: processedData });
        }
      } catch (err) {
        console.error('Error updating author:', err);
      }
    },
    [session?.session, updateAuthor, prepareFormData],
  );

  const handleLogout = useCallback(async () => {
    try {
      setLogoutPending(true);
      setLogoutError(null);
      const res = await fetch('/api/v1/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to logout');
      router.replace('/');
      router.refresh();
    } catch (err) {
      setLogoutError((err as Error)?.message || 'Logout failed');
    } finally {
      setLogoutPending(false);
    }
  }, [router]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutPending}
            className="inline-flex items-center bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {logoutPending ? 'Logging out...' : 'Logout'}
          </button>
        </div>
        {logoutError && <div className="mb-4 text-red-600 text-sm">{logoutError}</div>}
        <form onSubmit={handleSubmit(onUpdateHandler)} className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="shrink-0 relative">
              {/* Image Preview Container */}
              <div className="h-24 w-24 rounded-full relative">
                {/* Loading state */}
                {imageLoading && (
                  <div className="h-full w-full bg-gray-100 rounded-full flex items-center justify-center">
                    <div className="animate-pulse">
                      <svg
                        className="w-6 h-6 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                )}

                {/* Error state */}
                {imageError && !imageLoading && (
                  <div className="h-full w-full bg-gray-100 rounded-full flex items-center justify-center text-red-500 text-xs font-medium">
                    Image Error
                  </div>
                )}

                {/* Image preview */}
                {imagePreview && !imageLoading && !imageError && (
                  <Image
                    className="h-24 w-24 object-cover rounded-full"
                    src={imagePreview}
                    alt="Profile preview"
                    height={96}
                    width={96}
                    onError={() => setImageError(true)}
                  />
                )}

                {/* Empty state */}
                {!imagePreview && !imageLoading && !imageError && (
                  <div className="h-full w-full bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xs font-medium">
                    NO Photo
                  </div>
                )}
              </div>
            </div>

            <Controller
              name="profileImage"
              control={control}
              render={() => (
                <FileInput
                  onChange={handleFileChange}
                  error={
                    errors.profileImage
                      ? String(errors.profileImage?.message)
                      : uploadError || undefined
                  }
                />
              )}
            />
          </div>

          {uploadError && <div className="text-red-500 text-sm mb-4">{uploadError}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Name" {...register('name')} error={errors.name?.message} />
            <Input
              label="Occupation"
              {...register('occupation')}
              error={errors.occupation?.message}
            />
          </div>

          <div>
            <Input label="Bio" {...register('bio')} error={errors.bio?.message} useTextArea />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Location" {...register('location')} error={errors.location?.message} />
            <Input label="Website" {...register('website')} error={errors.website?.message} />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isPending || isUpdating || isUploading}
            >
              {isPending || isUpdating || isUploading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Account;
