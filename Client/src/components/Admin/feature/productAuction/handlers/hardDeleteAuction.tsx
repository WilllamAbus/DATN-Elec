import { AppDispatch } from "../../../../../redux/store";
import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getDeleteListAuctionThunk, hardDeleteAuctionThunk } from "../../../../../redux/product/admin/Thunk";

const MySwal = withReactContent(Swal);

export const handleDeleteAuction = (
  productAuctionId: string, 
  dispatch: AppDispatch, 
  currentPage: number, 
  searchTerm: string
) => {

  MySwal.fire({
    title: "Xóa sản phẩm?",
    text: "Bạn có chắc muốn xóa sản phẩm này không!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Có",
    cancelButtonText: "Hủy",
  }).then(async (result: SweetAlertResult) => {
    if (result.isConfirmed) {
      try {
        const action = await dispatch(hardDeleteAuctionThunk(productAuctionId));
        if (hardDeleteAuctionThunk.rejected.match(action)) {
          const errorMsg = action.payload?.msg || "Đã xảy ra sự cố khi xóa sản phẩm.";
          notifyError(errorMsg);
        } else {
          const successMsg = action.payload?.msg || "Sản phẩm của bạn đã bị xóa.";
          notify(successMsg);
          dispatch(getDeleteListAuctionThunk({ page: currentPage, search: searchTerm }));
        }
      } catch (error) {
        notifyError("Đã xảy ra sự cố khi xóa sản phẩm.");
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
