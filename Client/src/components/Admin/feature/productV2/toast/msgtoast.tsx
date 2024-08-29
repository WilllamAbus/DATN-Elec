import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notify = (msg: string) => {
  toast.success(msg, {
    position: "top-center",
    autoClose: 1700,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
};

export const notifyError = (msg: string) => {
  toast.warn(msg, {
    position: "top-center",
    autoClose: 1700,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
};
