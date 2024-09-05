  import instance from "../../axios";
  import { HardDeleteResponse } from "./types/product";
  export const hardDeleteProduct = async (id: string): Promise<HardDeleteResponse> => {
    try {
      const response = await instance.delete(`/admin/product/hardDelete/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        err: 1,
        msg: error.response?.data?.msg || "Lỗi khi xóa sản phẩm",
        status: error.response?.status || 500,
        data: undefined
      };
    }
  };
