import { AppDispatch } from "../../../../../redux/store";
import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { deleteImageVariantThunk, getImageByVariantIdThunk } from "../../../../../redux/product/admin/Thunk";
const MySwal = withReactContent(Swal);
export const deleteImageVariant = (
  variantId: string,
  imageId: string,
  dispatch: AppDispatch,
  currentPage: number
) => {
  MySwal.fire({
    title: "Xóa ảnh?",
    text: "Bạn có chắc muốn xóa ảnh này không!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Có",
    cancelButtonText: "Hủy",
  }).then(async (result: SweetAlertResult) => {
    if (result.isConfirmed) {
      try {
        const action = await dispatch(deleteImageVariantThunk({ imageId, variantId }));
        if (deleteImageVariantThunk.rejected.match(action)) {
          const errorMsg =
            typeof action.payload === "string"
              ? action.payload
              : "Đã xảy ra sự cố khi xóa ảnh.";
          notifyError(errorMsg);
        } else {
          const successMsg = action.payload?.msg || "ảnh của bạn đã bị xóa.";
          notify(successMsg);
          dispatch(getImageByVariantIdThunk({ variantId, page: currentPage }));
        }
      } catch (error) {
        notifyError("Đã xảy ra sự cố khi xóa ảnh.");
      }
    }
  });
};

const notify = (message: string) => {
  MySwal.fire({
    title: "Đã xóa!",
    text: message,
    icon: "success",
    customClass: {
      confirmButton: "bg-blue-500 md:bg-green-500",
    },
  });
};

const notifyError = (message: string) => {
  MySwal.fire({
    title: "Lỗi!",
    text: message,
    icon: "error",
    customClass: {
      confirmButton: "bg-red-600",
    },
  });
};
