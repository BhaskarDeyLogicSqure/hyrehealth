# Enhanced React Query + Next.js SSR Setup

This documentation explains the improved React Query + Next.js SSR setup that provides robust server-side data fetching with SEO optimization, URL-based filtering, and pagination support.

## 🚀 Key Features

- **Server-Side Rendering**: Robust SSR with error handling and fallbacks
- **URL-Based Filtering**: Filters and pagination sync with URL parameters
- **Enhanced Error Handling**: Graceful degradation when SSR fails
- **Multiple Query Support**: Prefetch multiple queries in parallel
- **Type Safety**: Full TypeScript support throughout
- **SEO Optimized**: Proper meta tags and structured data support

## 📁 File Structure

```
src/
├── lib/
│   ├── server-query-client.ts     # Server-side query client
│   └── withQueryPrefetch.tsx      # Enhanced prefetch utilities
├── hooks/
│   └── useEnhancedQuery.ts        # URL-aware query hooks
├── api/
│   └── categories/
│       └── categoryApi.ts         # Enhanced API with filters
├── utils/
│   └── getQueryClientUtil.ts      # Improved query client config
└── themes/default/TreatmentCategories/
    ├── page.tsx                   # Server component with SSR
    └── ClientPage.tsx             # Client component with filters
```

## 🛠️ How to Use

### 1. Server-Side Data Fetching

#### Single Query (Backward Compatible)

```tsx
// pages/categories/page.tsx
import { withSingleQueryPrefetch } from "@/lib/withQueryPrefetch";
import { categoryApi } from "@/api/categories/categoryApi";

export default async function CategoriesPage() {
  return withSingleQueryPrefetch({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getCategories(),
    PageComponent: CategoriesClient,
  });
}
```

#### Multiple Queries with Error Handling

```tsx
// pages/dashboard/page.tsx
import { withQueryPrefetch } from "@/lib/withQueryPrefetch";

export default async function DashboardPage({ searchParams }) {
  const filters = {
    search: searchParams.search,
    page: parseInt(searchParams.page || "1"),
    limit: parseInt(searchParams.limit || "10"),
  };

  return withQueryPrefetch({
    queries: [
      {
        queryKey: ["categories", "filtered", filters],
        queryFn: () => categoryApi.getCategories(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
      {
        queryKey: ["stats"],
        queryFn: () => analyticsApi.getStats(),
        staleTime: 10 * 60 * 1000, // 10 minutes
      },
    ],
    PageComponent: DashboardClient,
    fallbackComponent: DashboardErrorFallback, // Optional error boundary
  });
}
```

### 2. Client-Side with URL Filters

```tsx
// components/CategoriesClient.tsx
"use client";
import { useFilteredQuery } from "@/hooks/useEnhancedQuery";
import { categoryApi, CategoryFilters } from "@/api/categories/categoryApi";

export default function CategoriesClient() {
  const {
    data: categoriesResponse,
    isLoading,
    error,
    filters,
    setSearch,
    setPage,
    setSortBy,
    updateFilters,
  } = useFilteredQuery(
    ["categories"],
    (filterParams) => categoryApi.getCategories(filterParams),
    ["search", "type", "sortBy", "sortOrder"] as (keyof CategoryFilters)[],
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div>
      {/* Search input automatically syncs with URL */}
      <input
        value={filters.search || ""}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />

      {/* Categories grid */}
      {categoriesResponse?.data?.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}

      {/* Pagination */}
      <Pagination
        currentPage={filters.page || 1}
        totalPages={categoriesResponse?.pagination?.pages || 1}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### 3. Enhanced API with Filters

```tsx
// api/categories/categoryApi.ts
export interface CategoryFilters {
  search?: string;
  type?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const categoryApi = {
  getCategories: async (
    filters: CategoryFilters = {}
  ): Promise<{
    data: Category[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  }> => {
    // Clean up undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );

    return apiService.get(GET_CATEGORIES_ENDPOINT.endpoint, cleanFilters);
  },
};
```

## 🔧 Configuration

### Query Client Configuration

The enhanced setup includes better retry logic and error handling:

```tsx
// utils/getQueryClientUtil.ts
const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: (failureCount, error) => {
          // Don't retry on server-side to avoid blocking SSR
          if (isServer) return false;

          // Don't retry 4xx errors except rate limiting
          const errorStatus = (error as any)?.status;
          if (errorStatus >= 400 && errorStatus < 500 && errorStatus !== 429) {
            return false;
          }

          return failureCount < 2;
        },
        throwOnError: false, // Prevent crashes
      },
    },
  });
};
```

## 🎯 Best Practices

### 1. URL Parameters

- Always sync filters with URL for better UX and SEO
- Use meaningful parameter names
- Handle pagination and sorting in URLs

### 2. Error Handling

- Provide fallback components for SSR failures
- Don't throw errors to prevent app crashes
- Log errors for monitoring

### 3. Performance

- Use appropriate stale times for different data types
- Prefetch related data when possible
- Avoid over-fetching with proper pagination

### 4. SEO

- Use server-side rendering for initial page load
- Include proper meta tags and structured data
- Handle loading states gracefully

## 📊 Examples

### Search with Debouncing

```tsx
const { setSearch } = useFilteredQuery(/* ... */);

// Debounced search
const debouncedSearch = useMemo(
  () => debounce((value: string) => setSearch(value), 300),
  [setSearch]
);
```

### Infinite Scroll

```tsx
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ["products", "infinite"],
  queryFn: ({ pageParam = 1 }) =>
    productApi.getProducts({ page: pageParam, limit: 20 }),
  getNextPageParam: (lastPage) =>
    lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
});
```

## 🚨 Error Handling

### Server-Side Fallbacks

```tsx
function ErrorFallback({ error }: { error?: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1>Something went wrong</h1>
        <p>Please try refreshing the page</p>
      </div>
    </div>
  );
}
```

### Client-Side Error Recovery

```tsx
if (error) {
  return (
    <div className="text-center py-8">
      <p className="text-red-600">Failed to load data</p>
      <button onClick={() => refetch()}>Try Again</button>
    </div>
  );
}
```

## 🔄 Migration Guide

### From Old Setup

1. Replace `withQueryPrefetch` calls with new enhanced version
2. Update client components to use `useFilteredQuery`
3. Add filter interfaces to your API functions
4. Update query client configuration

### Backward Compatibility

- Old `withQueryPrefetch` calls still work via `withSingleQueryPrefetch`
- Existing useQuery hooks continue to work
- No breaking changes to existing APIs

This setup provides a robust, scalable foundation for React Query + Next.js SSR with excellent SEO capabilities and user experience.
