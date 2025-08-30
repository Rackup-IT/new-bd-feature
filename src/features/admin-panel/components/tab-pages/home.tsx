"use client";

import ErrorBoundary from "@/components/error-boundary/error_boundary";
import LoadingSpinner from "@/components/loading-spinner/loading_spinner";
import { cn } from "@/utils/utils";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { PlayIcon, PlusIcon } from "@heroicons/react/24/outline";
import { nanoid } from "@reduxjs/toolkit";
import dynamic from "next/dynamic";
import React, { Suspense, useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  Section,
  addSection,
  reoderSections,
} from "../../../../store/slice/section_slice";
import { AppState } from "../../../../store/store";
import { useUploadPageApi } from "../../hooks/api/usePageApi";
import { useTabContext } from "../tab_context";
import TopBar from "../top_bar";

// Lazy-load heavier child components to reduce initial bundle size.
const SectionList = dynamic(() => import("../section_list"), {
  ssr: false,
  loading: () => <div className="min-h-[40px]" />,
});
const PostDialog = dynamic(() => import("../post_dialog"), {
  ssr: false,
  loading: () => null,
});

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const sections = useAppSelector((state: AppState) => state.secion.list);
  const sensors = useSensors(useSensor(PointerSensor));
  const { edition, setEdition, activeTab } = useTabContext();
  const {
    mutate: uploadPage,
    isPending: uploadPending,
    error: uploadError,
    reset: resetUploadError,
  } = useUploadPageApi();
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // helper to extract a safe error message from unknown error shapes
  const getErrorMessage = (err: unknown) => {
    if (!err) return "Unknown error";
    if (err instanceof Error) return err.message;
    try {
      const maybe = err as { message?: string };
      return maybe?.message ?? String(err);
    } catch {
      return String(err);
    }
  };

  // memoize derived IDs to avoid recreating arrays each render (helps children)
  const sectionIds = useMemo(
    () => sections.map((s: Section) => s._id),
    [sections]
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const from = sections.findIndex((s: Section) => s._id === active.id);
        const to = sections.findIndex((s: Section) => s._id === over.id);
        dispatch(reoderSections({ from, to }));
      }
    },
    [dispatch, sections]
  );

  const handleAddSection = useCallback(() => {
    dispatch(
      addSection({
        _id: nanoid(),
        title: "New Section",
        uploadedAt: new Date().toISOString(),
      })
    );
  }, [dispatch]);

  // prepare payload only when sections change
  const preparedSections = useMemo(
    () =>
      sections.map((s: Section) => ({
        // Add type annotation
        title: s.title,
        _id: s._id,
        uploadedAt: s.uploadedAt,
        // avoid `any` to satisfy lint rules: extract post id safely
        posts: Array.isArray(s.posts)
          ? s.posts.map((p: unknown) =>
              typeof p === "object" && p !== null && "_id" in p
                ? (p as { _id: string })._id
                : String(p)
            )
          : [],
        hightlightPost: s.hightlightPost,
      })),
    [sections]
  );

  const handleUpload = useCallback(async () => {
    try {
      resetUploadError();

      const newPost = {
        edition,
        navLink: activeTab.navLink,
        navTitle: activeTab.navTitle,
        sections: preparedSections,
      };

      await uploadPage(newPost);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      // keep same behaviour, but preserve stack
      console.error("Upload failed:", error);
    }
  }, [resetUploadError, edition, activeTab, preparedSections, uploadPage]);

  return (
    <div className="flex flex-col h-full">
      <TopBar />
      <div className="p-4">
        {showSuccessToast && (
          <div className="absolute top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
            Page uploaded successfully!
          </div>
        )}
        {uploadError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Upload Failed: </strong>
            <span className="block sm:inline">
              {getErrorMessage(uploadError)}
            </span>
            <button
              onClick={handleUpload}
              className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
            >
              Retry
            </button>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEdition("en")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium",
                edition === "en"
                  ? "bg-amber-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              )}
            >
              Global
            </button>
            <button
              onClick={() => setEdition("bn")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium",
                edition === "bn"
                  ? "bg-amber-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              )}
            >
              Bangladesh
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddSection}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
            >
              <PlusIcon className="w-5 h-5" />
              New Section
            </button>
            <button
              onClick={handleUpload}
              disabled={uploadPending}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200",
                uploadPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 active:scale-95",
                "text-white"
              )}
            >
              <span
                className={cn(
                  "transition-opacity",
                  uploadPending ? "opacity-0" : "opacity-100"
                )}
              >
                <PlayIcon className="w-5 h-5" />
              </span>
              {uploadPending && (
                <span className="absolute left-1/2 transform -translate-x-1/2">
                  <LoadingSpinner className="w-5 h-5" />
                </span>
              )}
              Upload
            </button>
          </div>
        </div>
        <ErrorBoundary
          fallback={
            <div className="text-red-500 text-center p-4">
              <p>
                This section has encountered an error. Our team has been
                notified.
              </p>
            </div>
          }
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext items={sectionIds} strategy={rectSortingStrategy}>
              <Suspense fallback={<div />}>
                {/* lazy-loaded */}
                <SectionList />
              </Suspense>
            </SortableContext>
          </DndContext>
        </ErrorBoundary>
      </div>

      {/* lazy-loaded dialog */}
      <PostDialog />
    </div>
  );
};

export default Home;
