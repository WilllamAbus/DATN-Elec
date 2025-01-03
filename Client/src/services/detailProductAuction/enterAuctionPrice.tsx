import instance from "../axios";
import { EnterAuctionPriceResponse } from "./types/enterAuctionPriceResponse";
import { AxiosError } from "axios";

export const enterAuctionPrice = async (slug: string, bidPrice: number): Promise<EnterAuctionPriceResponse> => {
  try {
    const response = await instance.post<EnterAuctionPriceResponse>(`/client/product-detail-auction/enter-one-update-bid-auction/${slug}`, { bidPrice });

    if (response.data.success) {
      return {
        success: true,
        err: 0,
        msg: response.data.msg,
        status: response.data.status,
        userId: response.data.userId,
      };
    } else {
      return {
        success: false,
        err: -1,
        msg: response.data.msg,
        status: "400",
        userId: null,
      };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        err: -1,
        msg: error.response?.data?.msg || "Không thể đặt giá",
        status: "500",
        userId: null,
      };
    } else {
      return {
        success: false,
        err: -1,
        msg: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        status: "500",
        userId: null,
      };
    }
  }
};
