import instance from "../../axios";
import { LimitPageAuctionProductResponse } from "./types/listPageAuction";

export const listPageAuction = async (
  page: number,
  _sort: string
): Promise<LimitPageAuctionProductResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      _sort, 
    });

    const response = await instance.get<LimitPageAuctionProductResponse>(
      `/client/product/auction-product?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching auction products:", error);
    throw new Error("Failed to fetch auction products");
  }
};
