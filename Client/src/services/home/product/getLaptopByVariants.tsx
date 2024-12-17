import instance from "../../axios";
import { GetLaptopVariantsResponse } from "../types/getLaptopByVariants";

export const getLaptopByVariants = async (
  page: number,
): Promise<GetLaptopVariantsResponse> => {
  try {
    const queryParams = new URLSearchParams({ page: page.toString() });
    const response = await instance.get<GetLaptopVariantsResponse>(`client/product/get-laptop/laptop?${queryParams.toString()}`);

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.msg);
    }
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};