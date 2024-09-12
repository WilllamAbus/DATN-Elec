import instance from "../../axios";
import { ProductVariantResponse, ProductVariant } from "./types";
import { AxiosError } from "axios";

export const addVariant = async (
  productId: string,
  variant: ProductVariant
): Promise<ProductVariantResponse<ProductVariant>> => {
  try {
    const formData = new FormData();
    formData.append("variant_name", variant.variant_name);
    formData.append("variant_description", variant.variant_description);
    formData.append("variant_price", variant.variant_price.toString());
    formData.append("variant_attributes", JSON.stringify(variant.variant_attributes));

    if (variant.image && variant.image.length > 0) {
      for (let i = 0; i < variant.image.length; i++) {
        formData.append("image", variant.image[i]);
      }
    } else {
      console.warn("ko có ảnh");
    }

    const response = await instance.post(`/admin/product/${productId}/addvariant`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Lỗi từ API:", error.response?.data);
      return {
        success: false,
        err: error.response?.data.err || 1,
        msg: error.response?.data.msg || "Đã xảy ra lỗi",
        status: error.response?.status || 500,
        error: error.message,
      };
    } else {
      console.error("Lỗi không xác định khi thêm biến thể:", error);
      return {
        success: false,
        err: 1,
        msg: "Có lỗi xảy ra khi thêm biến thể",
        status: 500,
        error: "Đã xảy ra lỗi không mong muốn",
      };
    }
  }
};
