import instance from "../../axios";
import { ProductV2 } from "../../../types/ProductV2";
import { ApiResponse } from "./types";
import { AxiosError } from "axios";

export const editProductV2 = async (product: ProductV2, productId: string): Promise<ApiResponse<ProductV2>> => {
  try {
    const formData = new FormData();
    formData.append("product_id", productId); 
    formData.append("product_name", product.product_name);
    formData.append("product_description", product.product_description);
    formData.append("product_type", product.product_type);
    formData.append("product_discount", product.product_discount.toString());
    formData.append("product_supplier", product.product_supplier);
    formData.append("product_brand", product.product_brand);
    formData.append("product_format", product.product_format);
    formData.append("product_condition", product.product_condition);
    formData.append("product_price", product.product_price.toString());
    formData.append("product_attributes", JSON.stringify(product.product_attributes));
    formData.append("weight_g", product.weight_g.toString());

    if (product.image && product.image.length > 0) {
      for (let i = 0; i < product.image.length; i++) {
        formData.append("image", product.image[i]);
      }
    } else {
      console.warn("No image provided");
    }

    const response = await instance.put(`/admin/product/edit/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("API error:", error.response?.data);
      return {
        success: false,
        err: error.response?.data.err || 1,
        msg: error.response?.data.msg || "An error occurred",
        status: error.response?.status || 500,
        error: error.message,
      };
    } else {
      console.error("Unexpected error during product edit:", error);
      return {
        success: false,
        err: 1,
        msg: "An error occurred while editing the product",
        status: 500,
        error: "Unexpected error occurred",
      };
    }
  }
};
