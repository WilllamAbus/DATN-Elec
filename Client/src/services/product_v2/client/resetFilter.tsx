import instance from "../../axios"; 
import { LimitPageAuctionProductResponse } from "./types/listPageAuction";
export const resetFilter = async (): Promise<LimitPageAuctionProductResponse> => {
  try {
    const response = await instance.get<LimitPageAuctionProductResponse>('/client/product/reset-filter');
    return response.data;
  } catch (error) {
    throw new Error("lỗi");
  }
};
