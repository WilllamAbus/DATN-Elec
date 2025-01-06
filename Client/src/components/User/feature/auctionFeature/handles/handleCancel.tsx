import { AppDispatch } from "../../../../../redux/store";
import { canceledAuctionThunk, getAuctionWinsByUserThunk, clearAuctionWinById } from "../../../../../redux/sessionAuction/thunk";
import { AuctionWin } from "../../../../../services/AuctionWinsByUser/types/getAuctionWinsByUser";
import { toast } from "react-hot-toast";

export const handleCancel = async (
  selectedAuction: AuctionWin | null,
  dispatch: AppDispatch,
  currentPage: number,
  setSelectedAuction: React.Dispatch<React.SetStateAction<AuctionWin | null>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (selectedAuction) {
    try {
      const response = await dispatch(canceledAuctionThunk({ auctionWinnerId: selectedAuction._id })).unwrap();
      toast.success(response.msg || "Hủy đấu giá thành công!");
      setSelectedAuction(null);
      setIsModalOpen(false);
      setTimeout(async () => {
        await dispatch(getAuctionWinsByUserThunk({ page: currentPage }));
        dispatch(clearAuctionWinById(selectedAuction._id));
      }, 1000);
    } catch (error: any) {
      toast.error(error.msg || "Hủy đấu giá thất bại!");
      console.error("Hủy đấu giá thất bại:", error);
    }
  }
};
