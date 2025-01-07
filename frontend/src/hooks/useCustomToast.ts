import { toast, ToastContainer as ReactToastifyContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCallback } from "react";

// Define possible toast statuses
type ToastStatus = "success" | "error" | "warning" | "info" | "default" | string;

const useCustomToast = () => {
  const showToast = useCallback(
    (
      message: string,
      status: ToastStatus = "default", // Default status
      options?: ToastOptions // Optional customization options
    ) => {
      const config: ToastOptions = {
        position: options?.position || "bottom-right", // Default position
        autoClose: options?.autoClose ?? 5000, // Default auto-close timeout
        hideProgressBar: options?.hideProgressBar ?? false, // Default progress bar visibility
        closeOnClick: options?.closeOnClick ?? true,
        pauseOnHover: options?.pauseOnHover ?? true,
        draggable: options?.draggable ?? true,
        progress: options?.progress ?? undefined,
        ...options, // Allow overriding all defaults with custom options
      };

      switch (status) {
        case "success":
          toast.success(message, config);
          break;
        case "error":
          toast.error(message, config);
          break;
        case "warning":
          toast.warning(message, config);
          break;
        case "info":
          toast.info(message, config);
          break;
        case "default":
        default:
          toast(message, config);
          break;
      }
    },
    []
  );

  return showToast;
};

// Properly export the ToastContainer for usage in the app
export const ToastContainer = ReactToastifyContainer;

export default useCustomToast;
