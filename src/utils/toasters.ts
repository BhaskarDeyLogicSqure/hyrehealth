import toast from "react-hot-toast";
type ToastTypes = "success" | "error" | "loading" | "custom";
type ShowToastFn = { message?: string; type?: ToastTypes; duration?: number };

export const showToast = ({ message = "", type = "error", duration = 4000 }: ShowToastFn) => {
  // For custom type, use the default toast function
  if (type === "custom") {
    toast(message, { duration });
    return;
  }
  
  // For other types, use the appropriate toast function
  toast[type](message, { 
    duration,
    style: {
      borderRadius: '10px',
      background: type === 'success' ? '#2E6141' : '#ef4444',
      color: '#fff',
    },
  });
};

export const successToast = (message: string) => {
  console.log("Showing success toast:", message); // Debug log
  showToast({ message, type: "success" });
};

export const errorToast = (error: unknown): void => {
  console.log("Showing error toast:", error); // Debug log
  
  if (typeof error === "string") {
    showToast({ message: error, type: "error" });
  } else if (typeof error === "object" && error !== null && ("message" in error || "reason" in error)) {
    const { message, reason } = error as { message?: string; reason?: string };
    showToast({ message: message ?? reason ?? "Something went wrong.", type: "error" });
  } else {
    showToast({ message: "Unknown error occurred", type: "error" });
  }
};
