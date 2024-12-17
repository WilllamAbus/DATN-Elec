import instance from "../../axios";
import { GetPhoneVariantsResponse } from "../types/getPhoneByVariants";

export const getPhoneByVariants = async (
  page: number,
): Promise<GetPhoneVariantsResponse> => {
  try {
    const queryParams = new URLSearchParams({ page: page.toString() });
    const response = await instance.get<GetPhoneVariantsResponse>(`client/product/get-phone/dien-thoai?${queryParams.toString()}`);

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.msg);
    }
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};