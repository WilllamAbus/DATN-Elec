import instance from "../../axios";
import { LimitDeleteListAuctionResponse } from "../types/getDeleteListAuction";

export const getDeleteListAuction = async (
  page: number,
  search?: string
): Promise<LimitDeleteListAuctionResponse> => {
  try {
    const queryParams = new URLSearchParams({ page: page.toString() });

    if (search) {
      queryParams.append("search", search);
    }

    const response = await instance.get<LimitDeleteListAuctionResponse>(
      `/admin/productAuction/delete-list-auction/?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Không tìm thấy sản phẩm đã xóa");
  }
};
