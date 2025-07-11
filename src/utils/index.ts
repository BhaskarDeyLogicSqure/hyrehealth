import { toast } from "sonner";

export const showToast = (message: string) => {
  toast.success(message);
};

export const errorHandler = (message: string) => {
  toast.error(message);
};
