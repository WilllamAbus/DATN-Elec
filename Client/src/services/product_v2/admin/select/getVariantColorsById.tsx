import instance from "../../../axios";
import { GetVariantColorsByIdResponse } from "../types/getVariantColorsById"; 

export const getVariantColorsById = async (product_variant_id: string): Promise<GetVariantColorsByIdResponse> => {
  try {
    const response = await instance.get<GetVariantColorsByIdResponse>(`/admin/product/get-color-variant/${product_variant_id}`);
console.log(response);

    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin màu sắc của biến thể:', error);
    return {
      success: false,
      err: -1,
      msg: 'Lỗi khi lấy thông tin màu sắc của biến thể',
      status: 500,
      data: [],
    };
  }
};
