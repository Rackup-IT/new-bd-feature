"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import ReduxProvider from "../../store/store_provider";

import { queryClient } from "../../lib/query_client";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider>{children}</ReduxProvider>
    </QueryClientProvider>
  );
}
