import instance from "../axios";
import { CheckStatusAuctionPricingRangeResponse } from "./types/checkStatusAuctionPricingRange";

export const checkStatusAuctionPricingRange = async (slug: string): Promise<CheckStatusAuctionPricingRangeResponse> => {
  try {
    const response = await instance.get<CheckStatusAuctionPricingRangeResponse>(`/client/product-detail-auction/check-status-auction-pricing-range/${slug}`);
    return response.data;
  } catch (error: any) {
    console.error('Lỗi khi kiểm tra trạng thái đấu giá:', error);
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