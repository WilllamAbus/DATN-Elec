import instance from "../../../axios";
import { ProductFormat, SelectProductFormatResponse } from "../types";

export const selectProductFormat = async (): Promise<ProductFormat[]> => {
  try {
    const response = await instance.get<SelectProductFormatResponse>(
      "/admin/product/selectProductFormat"
    );
    return response.data.productFormats;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách formats sản phẩm:", error);
    throw error;
  }
};
