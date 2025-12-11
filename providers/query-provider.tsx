"use client";

import { ThemeProvider } from "next-themes";
import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
