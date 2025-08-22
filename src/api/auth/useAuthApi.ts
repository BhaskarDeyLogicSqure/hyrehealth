import { useMutation } from "@tanstack/react-query";
import { authApi } from "./authApi";
import { useCookies } from "@/hooks/useCookies";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/actions/authAction";
import { useRouter } from "next/navigation";
import {
  showSuccessToast,
  showErrorToast,
} from "@/components/GlobalErrorHandler";

export const useAuthApi = () => {
  const { setCookie } = useCookies();
  const router = useRouter();
  const dispatch = useDispatch();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      // Set token in cookie
      setCookie("customer-token", response?.data?.token);
      showSuccessToast("Login successful");
      // Update Redux store
      dispatch(setUser(response?.data?.user));
      // Redirect to dashboard
      router.push("/profile");
    },
    onError: (error) => {
      // console.error("Login failed:", error);
      showErrorToast(error?.message);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (response) => {
      showSuccessToast("Password reset email sent");
    },
    onError: (error) => {
      showErrorToast(error?.message || "Something went wrong");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (response) => {
      showSuccessToast("Password reset successful");
    },
    onError: (error) => {
      showErrorToast(error?.message || "Something went wrong");
    },
  });

  return {
    // login
    login: loginMutation.mutateAsync,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,

    // forgot password
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error,

    // reset password
    resetPassword: resetPasswordMutation.mutateAsync,
    isResetPasswordLoading: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,
  };
};
