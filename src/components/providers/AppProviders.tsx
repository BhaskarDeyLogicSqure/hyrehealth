"use client";

import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/store";
import { useState } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute -> means that the data will be cached for 1 minute
            retry: 1, // means that the data will be retried 1 time
          },
        },
      })
  );

  return (
    <Provider store={store}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </Provider>
  );
}
