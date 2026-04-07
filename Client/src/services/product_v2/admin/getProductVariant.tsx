import instance from "../../axios";
import { ProductVariantResponse } from "./types/productVariant";
import { AxiosError } from "axios";

export const getVariantsByProductId = async (
  productId: string,
  page: number = 1,
  limit: number = 12
): Promise<ProductVariantResponse> => {
  try {
    const response = await instance.get<ProductVariantResponse>(
      `/admin/product/${productId}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.msg || "Không thể lấy danh sách biến thể sản phẩm."
      );
    } else {
      throw new Error("Có lỗi xảy ra.");
    }
  }
};
