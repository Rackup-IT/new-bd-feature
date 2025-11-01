"use client";

import LoadingSpinner from "@/components/loading-spinner/loading_spinner";
import { default as NextImage } from "next/image";
import { ChangeEvent, useRef, useState } from "react";

interface ProfileImageInputProps {
  label: string;
  error?: string;
  value?: File | string | null;
  onChange: (file: File | null) => void;
  isLoading?: boolean;
}

export function ProfileImageInput({
  label,
  error,
  value,
  onChange,
  isLoading = false,
}: ProfileImageInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);

    // Create preview URL if file is selected
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // Handle click on preview to remove image
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    onChange(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Determine if we have an image to display
  const hasImage = previewUrl || (typeof value === "string" && value);

  return (
    <div className="flex flex-col gap-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {/* Preview area */}
      {hasImage && (
        <div className="relative w-32 h-32 rounded-full overflow-hidden mb-2">
          <NextImage
            src={previewUrl || (typeof value === "string" ? value : "")}
            alt="Profile preview"
            className="w-full h-full object-cover"
            width={128}
            height={128}
            unoptimized={true}
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            aria-label="Remove profile image"
          >
            ×
          </button>
        </div>
      )}

      {/* File input */}
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          id="profile-image-upload"
        />
        <label
          htmlFor="profile-image-upload"
          className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200 transition-colors text-sm"
        >
          {hasImage ? "Change Image" : "Upload Image"}
        </label>

        {isLoading && <LoadingSpinner className="w-5 h-5" />}
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
