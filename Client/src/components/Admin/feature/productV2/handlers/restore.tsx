import { AppDispatch } from "../../../../../redux/store";
import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DeleteListProductThunk, restoreThunk } from "../../../../../redux/product/admin/Thunk";

const MySwal = withReactContent(Swal);

export const restoreProduct = (
  productId: string, 
  dispatch: AppDispatch, 
  currentPage: number, 
  searchTerm: string
) => {
  MySwal.fire({
    title: "Khôi phục?",
    text: "Bạn có muốn khôi phục sản phẩm này không!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Có",
    cancelButtonText: "Hủy",
  }).then(async (result: SweetAlertResult) => {
    if (result.isConfirmed) {
      try {
        const action = await dispatch(restoreThunk(productId));
        if (restoreThunk.rejected.match(action)) {
          const errorMsg = action.payload?.msg || "Đã xảy ra sự cố khi khôi phục sản phẩm.";
          notifyError(errorMsg);
        } else {
          const successMsg = action.payload?.msg || "Sản phẩm đã được khôi phục thành công.";
          notify(successMsg);
          dispatch(DeleteListProductThunk({ page: currentPage, search: searchTerm }));
        }
      } catch (error) {
        notifyError("Đã xảy ra sự cố khi khôi phục sản phẩm.");
      }
    }
  });
};

const notify = (message: string) => {
  MySwal.fire({
    title: "Đã khôi phục!",
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
