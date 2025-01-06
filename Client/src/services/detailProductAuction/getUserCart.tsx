import instance from "../axios";
import { GetUserCartResponse } from "./types/getUserCart";

export const getUserCart = async (): Promise<GetUserCartResponse> => {
  try {
    const response = await instance.get<GetUserCartResponse>('/client/product-detail-auction/check-list-cart');
    return response.data;
  } catch (error: any) {
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
