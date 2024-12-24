import instance from "../axios";
import { UserBidPriceResponse } from "./types/userBidPrice";
import { AxiosError } from "axios";

export const createOneUpdateBidAuction = async (
  slug: string,
  bidPrice: number
): Promise<UserBidPriceResponse> => {
  try {
    const response = await instance.post<UserBidPriceResponse>(
      `/client/product-detail-auction/create-one-update-bid-auction/${slug}`,
      { bidPrice }
    );

    if (response.data.success) {
      return {
        success: true,
        err: 0,
        msg: response.data.msg,
        status: "200",
        newPrice: response.data.newPrice, // Đảm bảo thêm giá trị newPrice
      };
    } else {
      return {
        success: false,
        err: -1,
        msg: response.data.msg,
        status: "400",
        newPrice: 0, // Hoặc giá trị mặc định phù hợp
      };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        err: -1,
        msg: error.response?.data?.msg || "Không thể đặt giá",
        status: "500",
        newPrice: 0, // Giá trị mặc định
      };
    } else {
      return {
        success: false,
        err: -1,
        msg: "An unexpected error occurred.",
        status: "500",
        newPrice: 0, // Giá trị mặc định
      };
    }
  }
};
