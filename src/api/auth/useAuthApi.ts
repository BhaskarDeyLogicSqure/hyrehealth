import { useMutation } from "@tanstack/react-query";
import { authApi } from "./authApi";
import { useCookies } from "@/hooks/useCookies";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/actions/authAction";
import { useRouter } from "next/navigation";

export const useAuthApi = () => {
  const { setCookie } = useCookies();
  const router = useRouter();
  const dispatch = useDispatch();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      // Set token in cookie
      setCookie("token", response.data.token);
      // Update Redux store
      dispatch(setUser(response.data.user));
      // Redirect to dashboard
      router.push("/profile");
    },
    onError: (error) => {
      setCookie("token", "error");
      router.push("/profile");
      console.error("Login failed:", error);
    },
  });

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
};
