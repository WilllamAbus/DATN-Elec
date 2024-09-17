import instance from "../../axios";
import { GetAllBrandPageAuctionResponse } from "./types/getAllBrandPageAuction";

export const getAllBrandPageAuction = async (): Promise<GetAllBrandPageAuctionResponse> => {
  try {
    const response = await instance.get<GetAllBrandPageAuctionResponse>("/client/sidebar/auction/get-all-brand");
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      err: 1,
      msg: "Lỗi",
      status: 500,
      brands: [],
      error: error.message,
    };
  }
};
