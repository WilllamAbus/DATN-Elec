import instance from "../../axios";
import { SoftDeleteResponse } from "./types/product";

export const softDeleteProduct = async (id: string): Promise<SoftDeleteResponse> => {
  try {
    const response = await instance.patch(`/admin/product/softDelete/${id}`);
    return response.data; 
  } catch (error: any) {
    return {
      success: false,
      err: 1,
      msg: error.response?.data?.msg || "Lỗi khi xóa sản phẩm",
      status: error.response?.status || 500, 
      data: null 
    };
  }
};
