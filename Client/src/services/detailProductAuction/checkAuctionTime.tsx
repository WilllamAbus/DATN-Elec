import instance from "../axios";
import { CheckAuctionTimeResponse } from "./types/checkAuctionTime";

export const checkAuctionTime = async (slug: string): Promise<CheckAuctionTimeResponse> => {
  try {
    const response = await instance.get<CheckAuctionTimeResponse>(`/client/product-detail-auction/check-auction-time/${slug}`);
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
