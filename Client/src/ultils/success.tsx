// success.tsx
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notify = () => {
  toast.success("Đã thêm thành công!", {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
};
export const notifyUpdate = () => {
  toast.success("Đã cập nhật thành công!", {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
};
