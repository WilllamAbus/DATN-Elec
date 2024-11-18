import { AppDispatch } from "../../../../../redux/store";
import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { deleteVariantThunk, getVariantsByProductIdThunk } from "../../../../../redux/product/admin/Thunk";

const MySwal = withReactContent(Swal);

export const deleteVariant = (
  variantId: string,
  productId: string,
  dispatch: AppDispatch,
  currentPage: number,
) => {

  MySwal.fire({
    title: "Xóa biến thể?",
    text: "Bạn có chắc muốn xóa biến thể này không!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Có",
    cancelButtonText: "Hủy",
  }).then(async (result: SweetAlertResult) => {
    if (result.isConfirmed) {
      try {
        const action = await dispatch(deleteVariantThunk(variantId));
        if (deleteVariantThunk.rejected.match(action)) {
          const errorMsg = action.payload?.msg || "Đã xảy ra sự cố khi xóa biến thể.";
          notifyError(errorMsg);
        } else {
          const successMsg = action.payload?.msg || "Biến thể của bạn đã bị xóa.";
          notify(successMsg);
          dispatch(getVariantsByProductIdThunk({ productId, page: currentPage }));

        }
      } catch (error) {
        notifyError("Đã xảy ra sự cố khi xóa biến thể.");
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
