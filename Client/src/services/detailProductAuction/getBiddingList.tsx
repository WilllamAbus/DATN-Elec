import instance from "../axios";
import { BiddingListResponse, AuctionWinner } from "./types/getBiddingList";

export const getBiddingList = async (
  slug: string,
  page: number,
  limit: number = 1
): Promise<BiddingListResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await instance.get<BiddingListResponse>(
      `/client/product-detail-auction/bidding-list/${slug}?${queryParams.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching bidding list:", error);
    throw new Error("Failed to fetch bidding list");
  }
};

export const getAuctionWinner = async (slug: string): Promise<AuctionWinner> => {
  try {
    const response = await instance.get<AuctionWinner>(
      `/client/product-detail-auction/process-winner/${slug}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching auction winner:", error);
    throw new Error("Failed to fetch auction winner");
  }
};