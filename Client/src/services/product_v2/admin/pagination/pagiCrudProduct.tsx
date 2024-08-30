import instance from "../../../axios";
import { LimitCrudProductResponse } from "../types";

export const pagiCrudProduct = async (page: number): Promise<LimitCrudProductResponse> => {
  try {
    const response = await instance.get<LimitCrudProductResponse>(
      `/admin/product/limit/?page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};
