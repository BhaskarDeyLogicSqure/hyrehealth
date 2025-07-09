import { useCookies } from "@/hooks/useCookies";
import { store } from "@/store/index";
import { clearAuth } from "@/store/actions/authAction";

export const decodeJWTToken = (token: string) => {
  if (!token) {
    return null;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const decodedData = JSON.parse(window.atob(base64));
  return decodedData;
};

export const getToken = (): string | null => {
  const { getCookie } = useCookies();
  return getCookie("token") || null;
};

// Non-hook version for use outside React components (like axios interceptors)
export const getTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') {
    return null; // Server-side rendering
  }
  
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'token') {
      return decodeURIComponent(value);
    }
  }
  return null;
};

export const isUserAuthenticated = () => {
  // Use non-hook version to avoid hook call issues
  const token = getTokenFromCookie();
  if (!token) {
    return false;
  }

  const tokenData = decodeJWTToken(token);
  const expDate = new Date(+tokenData.exp * 1000); // expire in sec. convert in msec.

  if (!expDate || expDate <= new Date()) {
    console.log("token expired...");
    logout();
    return false;
  }

  return true;
};

export const logout = (
  navigate?: (
    pathname: string,
    options?: { replace?: boolean | undefined; state?: unknown }
  ) => void
): void => {
  store.dispatch(clearAuth());
  localStorage.clear();

  if (navigate) {
    navigate("/login", { replace: true });
    // showToast({ message: "Logged out successfully", type: "success" });
  }
  // Redirect to login page if not already there
  // This is to handle the case when the user is logged out from a different tab
  if (!navigate && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};
