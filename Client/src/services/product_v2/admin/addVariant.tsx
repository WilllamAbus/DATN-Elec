import instance from "../../axios";
import { ProductVariantResponse, ProductVariant, RESPONSE_MESSAGES, STATUS_CODES } from "./types/addVariant";
import { AxiosError } from "axios";

export const addVariant = async (
  productId: string,
  variant: ProductVariant
): Promise<ProductVariantResponse> => {
  try {
    if (!productId || !variant) {
      console.error("Missing productId or variant data.");
      return {
        success: false,
        err: 1,
        msg: "Thiếu thông tin sản phẩm hoặc biến thể.",
        status: STATUS_CODES.BAD_REQUEST,
        variant: null,
      };
    }

  

    if (!variant.product) {
      variant.product = productId;
    }

    const formData = new FormData();
    formData.append("variant_name", variant.variant_name);

    if (variant.variant_description) {
      formData.append("variant_description", variant.variant_description);
    }

    if (variant.variant_original_price !== undefined) {
      formData.append("variant_original_price", variant.variant_original_price.toString());
    }
    if (variant.product_discount && typeof variant.product_discount === 'object') {
      formData.append("product_discount", variant.product_discount._id);
    } else if (typeof variant.product_discount === 'string') {
      formData.append("product_discount", variant.product_discount);
    }
    
    

    if (variant.battery && variant.battery.length > 0) {
      formData.append("battery", variant.battery.map((item) => item._id).join(","));
    }


    if (variant.cpu && variant.cpu.length > 0) {
      formData.append("cpu", variant.cpu.map((item) => item._id).join(","));
    }

    if (variant.graphicsCard && variant.graphicsCard.length > 0) {
      formData.append("graphicsCard", variant.graphicsCard.map((item) => item._id).join(","));
    }

    if (variant.operatingSystem && variant.operatingSystem.length > 0) {
      formData.append("operatingSystem", variant.operatingSystem.map((item) => item._id).join(","));
    }

    if (variant.ram && variant.ram.length > 0) {
      formData.append("ram", variant.ram.map((item) => item._id).join(","));
    }

    if (variant.screen && variant.screen.length > 0) {
      formData.append("screen", variant.screen.map((item) => item._id).join(","));
    }

    if (variant.storage && variant.storage.length > 0) {
      formData.append("storage", variant.storage.map((item) => item._id).join(","));
    }

    if (variant.product) {
      formData.append("product", variant.product);
    } else {
      console.error("Product ID is missing in the variant data");
      return {
        success: false,
        err: 1,
        msg: "Thiếu ID sản phẩm trong dữ liệu biến thể.",
        status: STATUS_CODES.BAD_REQUEST,
        variant: null,
      };
    }

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
