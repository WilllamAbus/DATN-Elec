import instance from "../axios";
import { HighBidderInformationResponse } from "./types/highBidderInformation";

export const highBidderInformation = async (slug: string): Promise<HighBidderInformationResponse> => {
  try {
    const response = await instance.get<HighBidderInformationResponse>(`/client/product-detail-auction/high-bidder-information/${slug}`);
    return response.data;
  } catch (error: any) {
    console.error('Lỗi khi lấy thông tin người trúng đấu giá:', error);
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
