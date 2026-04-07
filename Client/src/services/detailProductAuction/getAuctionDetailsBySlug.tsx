import instance from "../axios";
import { AuctionDetailsResponse } from "./types/getAuctionDetailsBySlug";

/**
 * Lấy chi tiết đấu giá dựa trên slug.
 * @param slug - Định danh của sản phẩm đấu giá.
 * @returns Promise chứa thông tin chi tiết đấu giá.
 */
export const getAuctionDetailsBySlug = async (
  slug: string
): Promise<AuctionDetailsResponse> => {
  try {
    const response = await instance.get<AuctionDetailsResponse>(
      `/client/product-detail-auction/product-auction-win-and-lose/${slug}`
    );

    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đấu giá:', error);
    return {
      code: "SERVER_ERROR",
      status: "error",
      message: "Lỗi khi lấy chi tiết đấu giá.",
      product: {} as AuctionDetailsResponse['product'],
      bidders: [],
    };
  }
};
