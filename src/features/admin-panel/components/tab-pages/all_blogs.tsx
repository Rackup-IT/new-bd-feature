"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ErrorBoundary from "../../../../components/error-boundary/error_boundary";
import SnackBar from "../../../../components/snackbar/snackbar";
import {
  useDeletePostApi,
  useGetAllPostApi,
  useUpdatePostApi,
} from "../../hooks/api/useAddPostApi";
import { DBResponseSchema } from "../../validation/blog/db_response";
import Table from "../table";
import createTableColumns from "../table_columns";

const AllBlogs: React.FC = () => {
  const queryClient = useQueryClient();
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [loadingPostId, setLoadingPostId] = useState<string | null>(null);
  const [successPostId, setSuccessPostId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localPosts, setLocalPosts] = useState<DBResponseSchema[] | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    mutate: getAllPostReq,
    data: allPost,
    isPending: allPostPending,
  } = useGetAllPostApi();

  const { mutate: updatePostReq } = useUpdatePostApi();
  const { mutate: deletePostReq } = useDeletePostApi();

  // Initialize local posts with API data
  useEffect(() => {
    if (allPost) {
      setLocalPosts(allPost);
    }
  }, [allPost]);

  // Debounced status change handler
  const handleStatusChange = useCallback(
    (row: DBResponseSchema, status: string) => {
      // Clear any existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Optimistic update - update local state immediately
      const updatedPosts =
        localPosts?.map((post) =>
          post._id === row._id
            ? {
                ...post,
                status,
                updatedAt: new Date().toISOString(), // Track when this was updated
              }
            : post
        ) || [];

      setLocalPosts(updatedPosts);
      setLoadingPostId(row._id || null);
      setErrorMessage(null);

      // Set timeout for debouncing
      debounceTimeoutRef.current = setTimeout(() => {
        // Update backend after debounce delay
        updatePostReq(
          { id: row.slug, data: { status } },
          {
            onSuccess: () => {
              setLoadingPostId(null);
              setSuccessPostId(row._id || null);

              // Clear success state after animation
              setTimeout(() => {
                setSuccessPostId(null);
              }, 1200);

              // Invalidate queries to ensure data consistency
              queryClient.invalidateQueries({ queryKey: ["post-list"] });
            },
            onError: (error: unknown) => {
              // Rollback on error
              setLocalPosts(localPosts);
              setLoadingPostId(null);
              setErrorMessage(
                error instanceof Error
                  ? error.message
                  : "Failed to update status"
              );
            },
          }
        );
      }, 300); // 300ms debounce delay
    },
    [updatePostReq, queryClient, localPosts]
  );

  const handleDelete = useCallback(
    (row: DBResponseSchema) => {
      setDeletingPostId(row._id!);
      deletePostReq(
        { id: row.slug },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["post-list"] });
          },
          onError: () => {
            setDeletingPostId(null);
          },
        }
      );
    },
    [deletePostReq, queryClient]
  );

  const columns = useMemo(
    () =>
      createTableColumns({
        onStatusChange: handleStatusChange,
        onDelete: handleDelete,
        loadingPostId,
        successPostId,
      }),
    [handleStatusChange, handleDelete, loadingPostId, successPostId]
  );

  useEffect(() => {
    getAllPostReq();
  }, [getAllPostReq]);

  if (allPostPending || !localPosts) {
    return <p>Loading data...</p>;
  }

  return (
    <ErrorBoundary>
      <div className="relative">
        {errorMessage && (
          <SnackBar
            message={errorMessage}
            className="bg-red-500 text-white"
            duration={3000}
          />
        )}
        <Table<DBResponseSchema>
          data={localPosts}
          columns={columns}
          rowKey="_id"
          getRowClassName={(row) =>
            row._id === deletingPostId
              ? "opacity-50"
              : row._id === loadingPostId
              ? "loading"
              : ""
          }
        />
      </div>
    </ErrorBoundary>
  );
};

export default AllBlogs;
