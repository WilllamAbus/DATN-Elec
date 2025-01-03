import instance from "../axios";
import { AuctionPricingRangeResponse } from "./types/getAuctionPricingRange";

export const getAuctionPricingRange = async (slug: string): Promise<AuctionPricingRangeResponse> => {
  try {
    const response = await instance.get<AuctionPricingRangeResponse>(`/client/product-detail-auction/product-auction-check-current-price/${slug}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { code, msg } = error.response.data;
      throw { code, msg };
    } else if (error.request) {
      throw { code: 'KHONG_PHAN_HOI_TU_SERVER', msg: 'Không nhận được phản hồi từ server. Vui lòng thử lại sau.' };
    } else {
      throw { code: 'LOI_CHUNG', msg: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' };
    }
  }
};

