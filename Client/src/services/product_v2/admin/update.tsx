import instance from "../../axios";
import { Product, reponseProduct } from "../../../services/product_v2/admin/types/add-product";
import { AxiosError } from "axios";

export const updateProductV2 = async (id: string, product: Product): Promise<reponseProduct> => { 
  try {
    const formData = new FormData();
    formData.append("product_name", product.product_name);
    formData.append("product_description", product.product_description);
    formData.append("product_type", product.product_type);
    formData.append("product_supplier", product.product_supplier);
    formData.append("product_brand", product.product_brand);
    formData.append("product_condition", product.product_condition);
    formData.append("weight_g", product.weight_g.toString());

    if (product.image && product.image.length > 0) {
      for (let i = 0; i < product.image.length; i++) {
        formData.append("image", product.image[i]);
      }
    } else {
      console.warn("No images provided");
    }
    
    if (product.variants && product.variants.length > 0) {
      formData.append("variants", JSON.stringify(product.variants));
    }
    
    const response = await instance.put(`/admin/product/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      err: 0,
      msg: response.data.msg,
      status: response.status,
      product: response.data.product 
    };
    
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        err: error.response?.data.err || 1,
        msg: error.response?.data.msg || "lỗi",
        status: error.response?.status || 500,
        error: error.message,
      };
    } else {
      return {
        success: false,
        err: 1,
        msg: "lỗi khi cập nhật sản phẩm",
        status: 500,
        error: "lỗi",
      };
    }
  }
};

