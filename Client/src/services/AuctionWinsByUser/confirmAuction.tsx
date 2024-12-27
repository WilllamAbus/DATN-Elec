import instance from "../axios";
import { ConfirmAuctionResponse } from "./types/confirmAuction";

export const confirmAuction = async (auctionWinnerId: string): Promise<ConfirmAuctionResponse> => {
  try {
    const response = await instance.post<ConfirmAuctionResponse>('/client/auction/confirm-auction', {
      auctionWinnerId
    });
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
