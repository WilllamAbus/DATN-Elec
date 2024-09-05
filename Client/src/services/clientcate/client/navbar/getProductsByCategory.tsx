import instance from "../../../axios";
import { GetProductsByCategoryResponse } from "../types/getProuctbyCategory";

export const getProductsByCategory = async (
  categoryId: string,
  page: number = 1
): Promise<GetProductsByCategoryResponse> => {
  try {
    const response = await instance.get<GetProductsByCategoryResponse>(
      `client/product/category/${categoryId}`,
      {
        params: { page },
      }
    );

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.msg);
    }
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};
