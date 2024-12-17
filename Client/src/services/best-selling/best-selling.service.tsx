import instance from "../axios";

// Import interface đã định nghĩa
import { BestSellingProductResponse } from "../../types/best-selling/best-selling";

export const getBestSellings = async (): Promise<BestSellingProductResponse> => {
  try {
    const response = await instance.get(`/client/best-selling/best-selling`);
    console.log("Listing best-selling products:", response.data);

    return response.data as BestSellingProductResponse;
  } catch (error) {
    console.error("Error fetching best-selling list:", error);
    throw error;
  }
};
