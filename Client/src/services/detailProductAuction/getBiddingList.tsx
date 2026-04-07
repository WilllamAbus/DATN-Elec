import instance from "../axios";
import { BiddingListResponse } from "./types/getBiddingList";

export const getBiddingList = async (
  slug: string,
  page: number,
  limit: number = 5
): Promise<BiddingListResponse> => {
  console.log("Service called with slug:", slug, "page:", page, "limit:", limit);
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    console.log(
      `Calling URL: ${instance.defaults.baseURL}/client/product-detail-auction/bidding-list/${slug}?${queryParams.toString()}`
    );

    // Make the GET request
    const response = await instance.get<BiddingListResponse>(
      `/client/product-detail-auction/bidding-list/${slug}?${queryParams.toString()}`
    );
    console.log(response);

    // Return the data from the response
    return response.data;
  } catch (error) {
    console.error("Error fetching bidding list:", error);
    throw new Error("Failed to fetch bidding list");
  }
};
