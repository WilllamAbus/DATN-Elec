import { ProductAuction } from "../../../../../../services/detailProductAuction/types/detailAuction";
import { AppDispatch } from "../../../../../../redux/store";
import { enterAuctionPriceThunk } from "../../../../../../redux/product/client/Thunk";
import { toast } from "react-hot-toast";

export const handleBidSubmissionForEnterAuction = async (
  product: ProductAuction,
  userBidPrice: number | null,
  priceStep: number,
  currentPrice: number,
  dispatch: AppDispatch,
  userId: string,
  setCurrentPrice: React.Dispatch<React.SetStateAction<number>>,
  setUserBidPrice: React.Dispatch<React.SetStateAction<number | null>>
) => {
  const bidPrice = userBidPrice ?? priceStep;
  const newPrice = currentPrice + bidPrice;
  const previousPrice = currentPrice;

  setCurrentPrice(newPrice);
  setUserBidPrice(null);

  try {
    const resultAction = await dispatch(
      enterAuctionPriceThunk({ slug: product.slug, bidPrice: newPrice })
    );

    if (enterAuctionPriceThunk.fulfilled.match(resultAction)) {
      if (resultAction.payload && typeof resultAction.payload !== 'string') {
        if (resultAction.payload.userId !== userId) {
          toast.success(resultAction.payload.msg || "Đã đấu giá thành công!");
        } else {
          if (resultAction.payload.status === 'temporary') {
            return { success: true, status: 'temporary', msg: resultAction.payload.msg };
          }
          toast.success("Giá thầu của bạn đã được ghi nhận!");
        }
        return { success: true, status: resultAction.payload.status, msg: resultAction.payload.msg };
      } else {
        setCurrentPrice(previousPrice);
        toast.error("Không có dữ liệu trả về từ máy chủ hoặc phản hồi không hợp lệ.");
      }
    } else {
      const errorMessage =
        typeof resultAction.payload === 'string'
          ? resultAction.payload
          : resultAction.payload?.msg ?? "Có gì đó không ổn!";
      setCurrentPrice(previousPrice);
      toast.error(errorMessage);
    }
  } catch (error) {
    setCurrentPrice(previousPrice);
    toast.error("Lỗi khi gửi giá thầu: " + error);
  }
  return { success: false, msg: "Đã xảy ra lỗi khi gửi giá thầu." };
};
