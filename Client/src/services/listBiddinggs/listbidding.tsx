import instance from "../axios";
import {
  BiddingHistoryResponse,
  BiddingDetailsResponse,
} from "../../types/listBiddings/BiddingList";

/**
 * Fetch user bidding history with pagination.
 * @param {number} page - Current page number.
 * @param {number} pageSize - Number of items per page.
 * @returns {Promise<BiddingHistoryResponse>} - User bidding history response.
 */
export const getUserBiddingHistory = async (
  page = 1,
  pageSize = 5
): Promise<BiddingHistoryResponse> => {
  try {
    const response = await instance.get<BiddingHistoryResponse>(
      "client/product-detail-auction/user/bidding-history",
      {
        params: {
          page,
          limit: pageSize,
        },
      }
    );
    console.log("List Bidding",response);
    return response.data;
  } catch (error) {
    console.error("Error fetching user bidding history:", error);
    throw error;
  }
};

/**
 * Fetch user bidding details for a specific product.
 * @param {string} slug - Product slug to fetch bidding details.
 * @returns {Promise<BiddingDetailsResponse>} - Bidding details response.
 */
export const getUserBiddingDetails = async (
  slug: string
): Promise<BiddingDetailsResponse> => {
  if (!slug) {
    throw new Error("Slug is required to fetch bidding details.");
  }

  try {
    const response = await instance.get<BiddingDetailsResponse>(
      `client/product-detail-auction/user/bidding-details/${slug}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user bidding details:", error);
    throw error;
  }
};
