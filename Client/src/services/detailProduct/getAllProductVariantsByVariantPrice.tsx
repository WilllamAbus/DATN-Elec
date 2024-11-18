import instance from "../axios";
import { GetAllProductVariantsByVariantPriceResponse } from "./types/getAllProductVariantsByVariantPrice";


export const getAllProductVariantsByVariantPrice = async (
  slug: string
): Promise<GetAllProductVariantsByVariantPriceResponse> => {
  try {
    const response = await instance.get<GetAllProductVariantsByVariantPriceResponse>(
      `/client/product-detail/product/same-price/${slug}`
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
    };
  }
};
