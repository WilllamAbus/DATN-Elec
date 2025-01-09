import instance from "../axios";
import { CheckAuctionTimeAuctionPricingRangeResponse } from "./types/checkAuctionTimeAuctionPricingRange";

export const checkAuctionTimeAuctionPricingRange = async (slug: string): Promise<CheckAuctionTimeAuctionPricingRangeResponse> => {
  try {
    const response = await instance.get<CheckAuctionTimeAuctionPricingRangeResponse>(`/client/product-detail-auction/check-auctio-time-auction-pricing-range/${slug}`);
    return response.data;
  } catch (error: any) {
    console.error('Lỗi khi kiểm tra thời gian đấu giá:', error);
    if (error.response) {
      const { code, message } = error.response.data;
      throw { code, message };
    } else if (error.request) {
      throw { code: 'KHONG_PHAN_HOI_TU_SERVER', message: 'Không nhận được phản hồi từ server. Vui lòng thử lại sau.' };
    } else {
      throw { code: 'LOI_CHUNG', message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' };
    }
  }
};
