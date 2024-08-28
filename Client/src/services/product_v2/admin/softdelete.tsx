import instance from "../../axios";
import { SoftDeleteResponse } from "./types/product";
export const softDeleteProduct = async (id: string): Promise<SoftDeleteResponse> => {
  try {
    const response = await instance.delete(`/api/admin/product/${id}`); 
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      err: 1,
      msg: "Lỗi khi xóa sản phẩm",
      status: error.response?.status || 500,
      error: error.message
    };
  }
};