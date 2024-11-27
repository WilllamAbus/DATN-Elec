import instance from "../axios";

// Import interface đã định nghĩa
import { Recommendation } from "../../types/recommendation";

export const getRecommendations = async (): Promise<Recommendation[]> => {
  try {
    const response = await instance.get(`/client/recommendation/getByID`);
    console.log('Listing recommendations', response.data);

    // Trả về đúng dữ liệu từ `recommendations`
    return response.data.recommendations as Recommendation[];
  } catch (error) {
    console.error("Error fetching recommendation list:", error);
    throw error;
  }
};
