import instance from "../axios";
import { ProductV2 } from "../../types/ProductV2";
export const addProductV2 = async (product: ProductV2) => {
  try {
    const formData = new FormData();
    formData.append("product_name", product.product_name);
    formData.append("product_description", product.product_description);
    formData.append("product_type", product.product_type);
    formData.append("product_discount", product.product_discount.toString());
    formData.append("product_supplier", product.product_supplier);
    formData.append("product_brand", product.product_brand);
    formData.append("product_format", product.product_format);
    formData.append("product_condition", product.product_condition);
    formData.append("product_quantity", product.product_quantity.toString());
    formData.append("product_price", product.product_price.toString());
    formData.append("product_attributes", JSON.stringify(product.product_attributes));
    formData.append("weight_g", product.weight_g.toString());
    if (product.image && product.image.length > 0) {
      for (let i = 0; i < product.image.length; i++) {
        formData.append("image", product.image[i]);
      }
    } else {
      console.warn("No images provided");
    }

    const response = await instance.post("/product_v2/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};
