import instance from "../../axios";
import { AxiosError } from "axios";
import { ApiResponse, ProductVariant } from "./types/editVariant";
import { STATUS_CODES, RESPONSE_MESSAGES } from "./types/addVariant"; // Ensure these are imported if used

export const editVariant = async (
  variantId: string,
  updatedData: Partial<ProductVariant>
): Promise<ApiResponse> => {
  try {
    const formData = new FormData();

    // Ensure variant ID is provided
    if (!variantId) {
      console.error("Missing variant ID.");
      return {
        success: false,
        err: 1,
        msg: "Thiếu ID biến thể.",
        status: STATUS_CODES.BAD_REQUEST,
        variant: {} as ProductVariant,
      };
    }
    
    // Append updated data to formData
    if (updatedData.variant_name) {
      formData.append("variant_name", updatedData.variant_name);
    }
    
    if (updatedData.variant_description) {
      formData.append("variant_description", updatedData.variant_description);
    }

    if (updatedData.variant_original_price !== undefined) {
      formData.append("variant_original_price", updatedData.variant_original_price.toString());
    }
    if (updatedData.product_discount && typeof updatedData.product_discount === 'object') {
      formData.append("product_discount", updatedData.product_discount._id);
    } else if (typeof updatedData.product_discount === 'string') {
      formData.append("product_discount", updatedData.product_discount);
    }
    if (updatedData.battery && updatedData.battery.length > 0) {
      formData.append("battery", updatedData.battery.map((item) => item._id).join(","));
    }


    if (updatedData.cpu && updatedData.cpu.length > 0) {
      formData.append("cpu", updatedData.cpu.map((item) => item._id).join(","));
    }

    if (updatedData.graphicsCard && updatedData.graphicsCard.length > 0) {
      formData.append("graphicsCard", updatedData.graphicsCard.map((item) => item._id).join(","));
    }

    if (updatedData.operatingSystem && updatedData.operatingSystem.length > 0) {
      formData.append("operatingSystem", updatedData.operatingSystem.map((item) => item._id).join(","));
    }

    if (updatedData.ram && updatedData.ram.length > 0) {
      formData.append("ram", updatedData.ram.map((item) => item._id).join(","));
    }

    if (updatedData.screen && updatedData.screen.length > 0) {
      formData.append("screen", updatedData.screen.map((item) => item._id).join(","));
    }

    if (updatedData.storage && updatedData.storage.length > 0) {
      formData.append("storage", updatedData.storage.map((item) => item._id).join(","));
    }

    // Add the variant ID
    formData.append("variantId", variantId);

    const response = await instance.put(`/admin/product/updateVariant/${variantId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      err: 0,
      msg: response.data.msg,
      status: response.status,
      variant: response.data.variant,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        err: error.response?.data.err || 1,
        msg: error.response?.data.msg || RESPONSE_MESSAGES.VARIANT_UPDATE_ERROR,
        status: error.response?.status || STATUS_CODES.SERVER_ERROR,
        variant: {} as ProductVariant,
      };
    } else {
      console.error("Lỗi không xác định khi cập nhật biến thể:", error);
      return {
        success: false,
        err: 1,
        msg: RESPONSE_MESSAGES.VARIANT_UPDATE_ERROR,
        status: STATUS_CODES.SERVER_ERROR,
        variant: {} as ProductVariant,
      };
    }
  }
};
