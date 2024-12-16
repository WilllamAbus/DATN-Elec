import instance from "../../axios";
import { ImageVariant, ImageVariantResponse } from "./types/imageVariant";
import { AxiosError } from "axios";

export const addImageVariant = async (
  product_variant_id: string,
  imageVariant: ImageVariant
): Promise<ImageVariantResponse> => {
  try {
    const formData = new FormData();

    if (imageVariant.color) {
      formData.append("color", imageVariant.color);
    }


    if (imageVariant.image && imageVariant.image.length > 0) {
      Array.from(imageVariant.image).forEach((img) => {
        if (img instanceof File) {
          formData.append("image", img);
        } else {
          console.warn("Skipping invalid image", img);
        }
      });
    } else {
      console.warn("Không có ảnh để thêm");
    }

    const response = await instance.post(`/admin/product/${product_variant_id}/add-image-variant`, formData, {
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
        err: error.response?.data?.err || 1,
        msg: error.response?.data?.msg || "Đã xảy ra lỗi",
        status: error.response?.status || 500,
        error: error.message,
      };
    } else {
      console.error("Lỗi không xác định khi thêm biến thể hình ảnh:", error);
      return {
        success: false,
        err: 1,
        msg: "Có lỗi xảy ra khi thêm biến thể hình ảnh",
        status: 500,
        error: "Đã xảy ra lỗi không mong muốn",
      };
    }
  }
};
