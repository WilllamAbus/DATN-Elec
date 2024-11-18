  import instance from "../../axios";
  import { EditImageVariantResponse, ImageVariant } from "./types/editImageVariant";

  export const editImageVariant = async (
    imageVariantId: string,
    imageVariant: ImageVariant
  ): Promise<EditImageVariantResponse> => {
    try {
      const formData = new FormData();
      
      if (imageVariant.color) {
        formData.append("color", imageVariant.color);
      }

      if (imageVariant.image && imageVariant.image.length > 0) {
        for (let i = 0; i < imageVariant.image.length; i++) {
          // Chỉ thêm file, không phải URL
          if (imageVariant.image[i] instanceof File) {
              formData.append("image", imageVariant.image[i]);
          }
        }
    }
    
      const response = await instance.put<EditImageVariantResponse>(
        `/admin/product/updateImageVariant/${imageVariantId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Lỗi khi cập nhật biến thể hình ảnh:", error);

      return {
        success: false,
        msg: "Lỗi khi cập nhật biến thể hình ảnh",
        error: error?.message,
      };
    }
  };
