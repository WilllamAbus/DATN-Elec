import { AppDispatch } from "../../../../../redux/store";
import { canceledAuctionTemporaryThunk, getAuctionWinsByUserThunk, clearAuctionWinById } from "../../../../../redux/sessionAuction/thunk";
import { AuctionWin } from "../../../../../services/AuctionWinsByUser/types/getAuctionWinsByUser";
import { toast } from "react-hot-toast";

export const handleCancelTemporary = async (
  selectedAuction: AuctionWin | null,
  dispatch: AppDispatch,
  currentPage: number,
  setSelectedAuction: React.Dispatch<React.SetStateAction<AuctionWin | null>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (selectedAuction) {
    try {
      const response = await dispatch(canceledAuctionTemporaryThunk({ auctionWinnerId: selectedAuction._id })).unwrap();
      toast.success(response.msg || "Hủy đấu giá tạm thời thành công!");
      setSelectedAuction(null);
      setIsModalOpen(false);
      setTimeout(async () => {
        await dispatch(getAuctionWinsByUserThunk({ page: currentPage }));
        dispatch(clearAuctionWinById(selectedAuction._id));
      }, 1000);
    } catch (error: any) {
      toast.error(error.msg || "Hủy đấu giá tạm thời thất bại!");
      console.error("Hủy đấu giá tạm thời thất bại:", error);
    }
  }
};
