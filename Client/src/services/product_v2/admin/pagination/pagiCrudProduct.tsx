import instance from "../../../axios";
import { LimitCrudProductResponse } from "../types";

export const pagiCrudProduct = async (
  page: number,
  search?: string
): Promise<LimitCrudProductResponse> => {
  try {
    const queryParams = new URLSearchParams({ page: page.toString() });

    if (search) {
      queryParams.append("search", search);
    }

    const response = await instance.get<LimitCrudProductResponse>(
      `/admin/product/limit/?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};
