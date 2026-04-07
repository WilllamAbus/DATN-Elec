import { AppDispatch } from "../../../../../redux/store";
import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getListRamThunk, softDeleteRamThunk } from "../../../../../redux/attribute/thunk";

const MySwal = withReactContent(Swal);

export const handlesoftDeleteRam = (
  ramId: string, 
  dispatch: AppDispatch, 
  currentPage: number, 
  searchTerm: string
) => {
  MySwal.fire({
    title: "Xóa ram?",
    text: "Bạn có chắc muốn xóa ram này không!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Có",
    cancelButtonText: "Hủy",
  }).then(async (result: SweetAlertResult) => {
    if (result.isConfirmed) {
      try {
        const action = await dispatch(softDeleteRamThunk({ ramId }));
        
        if (softDeleteRamThunk.rejected.match(action)) {
          const errorMsg = typeof action.payload === "string" 
            ? action.payload 
            : "Đã xảy ra sự cố khi xóa ram.";
          notifyError(errorMsg);
        } else {
          const successMsg = action.payload?.msg || "ram của bạn đã bị xóa.";
          notify(successMsg);
          dispatch(getListRamThunk({ page: currentPage, search: searchTerm }));
        }
      } catch (error) {
        notifyError("Đã xảy ra sự cố khi xóa ram.");
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
