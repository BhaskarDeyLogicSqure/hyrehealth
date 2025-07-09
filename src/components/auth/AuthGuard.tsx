"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector(
    (state: RootState) => state.authReducer
  );

  // useEffect(() => {
  //   // Check auth status on mount if we don't have user data
  //   if (!user && !isLoading) {
  //     dispatch(checkAuthStatus());
  //   }
  // }, [dispatch, user, isLoading]);

  // useEffect(() => {
  //   // Redirect to login if not authenticated and not loading
  //   if (!isLoading && !isAuthenticated) {
  //     router.push("/auth/login");
  //   }
  // }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking authentication
  // if (isLoading) {
  //   return (
  //     fallback || (
  //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //         <div className="flex flex-col items-center space-y-4">
  //           <Loader2 className="h-8 w-8 animate-spin text-brand-dark-blue" />
  //           <p className="text-gray-600">Verifying authentication...</p>
  //         </div>
  //       </div>
  //     )
  //   );
  // }

  // // Show nothing while redirecting to login
  // if (!isAuthenticated) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="flex flex-col items-center space-y-4">
  //         <Loader2 className="h-8 w-8 animate-spin text-brand-dark-blue" />
  //         <p className="text-gray-600">Redirecting to login...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Render protected content if authenticated
  return <>{children}</>;
}

// Higher Order Component version for easier usage
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard fallback={fallback}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}
