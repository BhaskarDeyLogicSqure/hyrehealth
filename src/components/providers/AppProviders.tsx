"use client";

import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { getQueryClient } from "@/utils/getQueryClientUtil";
import ThemeLoader from "../ThemeLoader";

interface AppProvidersProps {
  children: React.ReactNode;
}

// Loading component for PersistGate
const PersistLoading = () => (
  <ThemeLoader variant="full-page" message="Loading..." />
);

export function AppProviders({ children }: AppProvidersProps) {
  const queryClient = getQueryClient(); // we get the query client from the util

  return (
    <Provider store={store}>
      <PersistGate loading={<PersistLoading />} persistor={persistor}>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            {/* Show devtools only in development */}
            {process.env.NODE_ENV === "development" && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </QueryClientProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
