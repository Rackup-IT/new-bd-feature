import { axiosClient } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosRequestConfig } from "axios";
import { useState } from "react";

interface StructuredApiError<TPayload = unknown> {
  message: string;
  statusCode?: number;
  payload?: TPayload;
}

export interface ApiMutationOptions<TData, TVars, TPayload> {
  invalidateKey?: unknown[];
  //  What it is: A React Query “query key” (or partial key) you want to mark as stale after a successful mutation.

  // Why: Suppose you have a blog list cached under ["admin","blogs"]. After you create or delete a blog, you need that list to refresh. By passing invalidateKey: ["admin","blogs"], React Query will automatically refetch that data for you.

  method: "get" | "post" | "patch" | "delete" | "put";

  url: (vars: TVars) => string;
  //   What it does: Generates the request URL based on the variables you pass.
  // Example:
  // url: (vars) => `/api/blog/${vars.id}`
  // This allows you to embed IDs, query parameters, or dynamic segments.

  prepare: (vars: TVars) => unknown | Promise<unknown>;
  //   Purpose: Transform your raw variables into the actual request payload.
  // When to use:
  // Converting a form-value object into FormData.
  // Stripping out UI-only props.
  // Compressing images before upload.

  axiosConfig?: AxiosRequestConfig;
  //   Any extra Axios settings—custom headers, query params, timeouts, etc.
  //   Merged into the request so you can override things on a per-mutation basis.

  onSuccess?: (data: TData, vars: TVars) => void;
  //   A callback run after the mutation succeeds (and after any invalidation).
  // Useful for showing a toast, navigating to a new page, or logging analytics.
  parseError?: (
    errorData: unknown,
    statusCode?: number
  ) => StructuredApiError<TPayload>;
  /**
   * Optional. A custom function to parse the error response body.
   * Receives the raw `error.response.data` and should return a string.
   * If not provided, it defaults to looking for a `message` property.
   * @param errorData The raw data from the error response.
   * @returns A string representing the error message.
   */
}

export function useApiMutation<
  TData = unknown,
  Tvars = void,
  TPayload = unknown
>(opts: ApiMutationOptions<TData, Tvars, TPayload>) {
  const qc = useQueryClient();
  const [apiError, setApiError] = useState<StructuredApiError<TPayload> | null>(
    null
  );

  const mutation = useMutation<TData, Error, Tvars>({
    mutationFn: async (vars: Tvars) => {
      const body = opts.prepare ? await opts.prepare(vars) : vars;
      const res = await axiosClient.request<TData>({
        method: opts.method, // ✅ also fix typo from opts.methods
        url: opts.url(vars),
        data: body,
        ...opts.axiosConfig,
      });
      return res.data;
    },
    onSuccess: (data, vars) => {
      if (opts.invalidateKey) {
        qc.invalidateQueries({ queryKey: opts.invalidateKey });
      }
      opts.onSuccess?.(data, vars);
    },
    onError: (err) => {
      // No response body, use the generic message
      if (!(err instanceof AxiosError)) {
        setApiError({
          message: err.message || "An unexpected network error occurred.",
        });
        return;
      }

      const errorData = err.response?.data;
      const statusCode = err.response?.status;
      if (!errorData) {
        setApiError({
          message:
            err.message ||
            "An error occurred with no response from the server.",
        });
        return;
      }

      // 2. This is the new, flexible logic
      // If a custom parser is provided, use it.
      if (opts.parseError) {
        setApiError(opts.parseError(errorData, statusCode));
      } else {
        const serverError = errorData as { message: string; errors?: TPayload };
        setApiError({
          message: serverError.message,
          statusCode: statusCode,
          payload: serverError.errors,
        });
      }
    },
  });

  return { ...mutation, error: apiError };
}
