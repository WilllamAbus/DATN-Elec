import instance from "../axios";
import { GetAllProductVariantsByVariantPriceResponse } from "./types/getAllProductVariantsByVariantPrice";

export const getAllProductVariantsByVariantPrice = async (
  slug: string,
  page: number
): Promise<GetAllProductVariantsByVariantPriceResponse> => {
  try {
    const queryParams = new URLSearchParams({ page: page.toString() });

    const response = await instance.get<GetAllProductVariantsByVariantPriceResponse>(
      `/client/product-detail/product/same-price/${slug}?${queryParams.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin variants theo giá:", error);
    return {
      success: false,
      err: -1,
      msg: "Lỗi khi lấy thông tin variants theo giá",
      status: 500,
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
};
