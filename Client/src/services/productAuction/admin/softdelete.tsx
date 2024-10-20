import instance from "../../axios";
import { SoftDeleteResponse, ProductAuction } from "../types/softdelete";
export const softDeleteProduct = async (id: string): Promise<SoftDeleteResponse> => {
  try {
    const response = await instance.patch(`/admin/productAuction/softDelete/${id}`);
    const product: ProductAuction = response.data.data; 
    return {
      success: true,
      err: 0,
      msg: response.data.msg || "Đã xóa thành công",
      status: 200,
      data: product, 
    };
  } catch (error: any) {
    return {
      success: false,
      err: 1,
      msg: error.response?.data?.msg || "Lỗi khi xóa sản phẩm",
      status: error.response?.status || 500,
      data: undefined, 
    };
  }
};
