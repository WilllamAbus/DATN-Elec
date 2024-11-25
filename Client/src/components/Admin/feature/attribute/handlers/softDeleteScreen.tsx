import { AppDispatch } from "../../../../../redux/store";
import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getListScreenThunk, softDeleteScreenThunk } from "../../../../../redux/attribute/thunk";

const MySwal = withReactContent(Swal);

export const handlesoftDeleteScreen = (
  screenId: string, 
  dispatch: AppDispatch, 
  currentPage: number, 
  searchTerm: string
) => {
  MySwal.fire({
    title: "Xóa màn hình?",
    text: "Bạn có chắc muốn xóa màn hình này không!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Có",
    cancelButtonText: "Hủy",
  }).then(async (result: SweetAlertResult) => {
    if (result.isConfirmed) {
      try {
        const action = await dispatch(softDeleteScreenThunk({ screenId }));
        
        if (softDeleteScreenThunk.rejected.match(action)) {
          const errorMsg = typeof action.payload === "string" 
            ? action.payload 
            : "Đã xảy ra sự cố khi xóa màn hình.";
          notifyError(errorMsg);
        } else {
          const successMsg = action.payload?.msg || "màn hình của bạn đã bị xóa.";
          notify(successMsg);
          dispatch(getListScreenThunk({ page: currentPage, search: searchTerm }));
        }
      } catch (error) {
        notifyError("Đã xảy ra sự cố khi xóa màn hình.");
      }
    }
  });
};
;

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
