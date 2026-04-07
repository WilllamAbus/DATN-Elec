import instance from "../../axios";
import { DeleteImageVariantResponse } from "./types/deleteImageVariant";

/**
 * Xoá ảnh theo imageId và variantId
 * @param imageId - ID của hình ảnh
 * @param variantId - ID của biến thể sản phẩm
 * @returns Trả về thông tin sau khi xoá
 */


export const deleteImageVariant = async (
  imageId: string,
  variantId: string
): Promise<DeleteImageVariantResponse> => {
  try {
    const response = await instance.delete<DeleteImageVariantResponse>(
      `/admin/product/delete-image-variant/${imageId}/${variantId}`
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi xoá ảnh theo biến thể sản phẩm:", error);

    return {
      success: false,
      err: -1,
      msg: "Lỗi khi xoá ảnh theo biến thể sản phẩm",
      status: 500,
    };
  }
};
