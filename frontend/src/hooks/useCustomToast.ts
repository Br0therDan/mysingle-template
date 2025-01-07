import { toast, ToastContainer as ReactToastifyContainer, ToastOptions, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCallback } from "react";

// Define possible toast statuses
type ToastStatus = "success" | "error" | "warning" | "info";

const useCustomToast = () => {
  const showToast = useCallback(
    (
      message: string,
      status: ToastStatus,
      options?: ToastOptions // Optional customization options
    ) => {
      const config: ToastOptions = {
        position: "bottom-right" as ToastPosition, // Ensure position matches ToastPosition type
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        ...options, // Allow overriding defaults
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
        default:
          toast(message, config);
      }
    },
    []
  );

  return showToast;
};

// Use `typeof` when exporting ReactToastifyContainer to ensure proper handling
export const ToastContainer = ReactToastifyContainer as unknown as React.FC;

export default useCustomToast;
