import instance from "../axios";
import { AuctionWinsResponse } from "./types/getAuctionWinsByUser";

export const getAuctionWinsByUser = async (page: number): Promise<AuctionWinsResponse> => {
  try {
    const queryParams = new URLSearchParams({ page: page.toString() });
    const response = await instance.get<AuctionWinsResponse>(`/client/auction/auction-win?${queryParams.toString()}`);
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
