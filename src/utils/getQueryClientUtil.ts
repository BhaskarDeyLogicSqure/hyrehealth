import { isServer, QueryClient } from "@tanstack/react-query";

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute -> means that the data will be cached for 1 minute
        retry: (failureCount, error) => {
          // Don't retry on server-side to avoid blocking SSR
          if (isServer) {
            return false;
          }

          // Client-side retry logic
          const errorStatus = (error as any)?.status;

          // Don't retry on 4xx errors except rate limiting
          if (errorStatus >= 400 && errorStatus < 500 && errorStatus !== 429) {
            return false;
          }

          // Retry up to 2 times for other errors
          return failureCount < 2;
        },
        // Shorter retry delay for better UX
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Better error handling
        throwOnError: false, // Prevent crashes, let components handle errors
      },
      mutations: {
        retry: 1, // Retry mutations once
        throwOnError: false,
      },
    },
  });
};

// storing the query client outside of the component to avoid creating a new instance on every render
// check for more: https://youtu.be/XcUpTPbY4Wg?si=CVnCDZIEcc0FZUZX&t=242
let browserQueryClient: QueryClient | undefined = undefined; // this is used to prevent the query client from being created on the server

export const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient(); // if we are on the server side, we create a new query client instance every time
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient(); // on the client, we create a new query client instance
    }
    return browserQueryClient;
  }
};
