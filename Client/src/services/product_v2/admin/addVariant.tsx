import instance from "../../axios";
import { ProductVariantResponse, ProductVariant,RESPONSE_MESSAGES, STATUS_CODES} from "./types/addVariant";
import { AxiosError } from "axios";

export const addVariant = async (
  productId: string,
  variant: ProductVariant
): Promise<ProductVariantResponse> => {
  try {
    const formData = new FormData();
    formData.append("variant_name", variant.variant_name);

    if (variant.variant_description) {
      formData.append("variant_description", variant.variant_description);
    }
    
    if (variant.variant_price !== undefined) {
      formData.append("variant_price", variant.variant_price.toString());
    }

    if (variant.battery) {
      formData.append("battery", variant.battery.map((item) => item._id).join(","));
    }
    
    if (variant.color) {
      formData.append("color", variant.color.map((item) => item._id).join(","));
    }
    
    if (variant.cpu) {
      formData.append("cpu", variant.cpu.map((item) => item._id).join(","));
    }
    
    if (variant.graphicsCard) {
      formData.append("graphicsCard", variant.graphicsCard.map((item) => item._id).join(","));
    }
    
    if (variant.operatingSystem) {
      formData.append("operatingSystem", variant.operatingSystem.map((item) => item._id).join(","));
    }
    
    if (variant.ram) {
      formData.append("ram", variant.ram.map((item) => item._id).join(","));
    }
    
    if (variant.screen) {
      formData.append("screen", variant.screen.map((item) => item._id).join(","));
    }
    
    if (variant.storage) {
      formData.append("storage", variant.storage.map((item) => item._id).join(","));
    }

    if (variant.image && variant.image.length > 0) {
      for (let i = 0; i < variant.image.length; i++) {
        formData.append("image", variant.image[i]);
      }
    } else {
      console.warn("Không có ảnh");
    }

    formData.append("product", variant.product); // Product is still required

    const response = await instance.post(`/admin/product/${productId}/addvariant`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; 
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        err: error.response?.data.err || 1,
        msg: error.response?.data.msg || RESPONSE_MESSAGES.VARIANT_ADD_ERROR, 
        status: error.response?.status || STATUS_CODES.SERVER_ERROR,
        variant: null, 
      };
    } else {
      console.error("Lỗi không xác định khi thêm biến thể:", error);
      return {
        success: false,
        err: 1,
        msg: RESPONSE_MESSAGES.VARIANT_ADD_ERROR, 
        status: STATUS_CODES.SERVER_ERROR, 
        variant: null,
      };
    }
  }
};
