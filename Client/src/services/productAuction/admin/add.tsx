
import instance from "../../axios";
import { ProductAuction,reponseProduct } from "../../product_v2/admin/types/add-product-auction";

import { AxiosError } from "axios";
export const addProductAuction = async (product: ProductAuction): Promise<reponseProduct> => {
  try {

    const formData = new FormData();
    formData.append("product_name", product.product_name);
    formData.append("product_description", product.product_description);
    formData.append("product_type", product.product_type);
    formData.append("product_supplier", product.product_supplier);
    formData.append("product_brand", product.product_brand);
    formData.append("product_condition", product.product_condition);
    formData.append("weight_g", product.weight_g.toString());

    for (let pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    if (product.image && product.image.length > 0) {
      for (let i = 0; i < product.image.length; i++) {
        formData.append("image", product.image[i]);
      }
    } else {
      console.warn("ko có ảnh");
    }

    const response = await instance.post("/admin/productAuction/add", formData, {
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
      console.error("Lỗi không xác định khi thêm sản phẩm:", error);
      return {
        success: false,
        err: 1,
        msg: "Có lỗi xảy ra khi thêm sản phẩm",
        status: 500,
        error: "Đã xảy ra lỗi không mong muốn",
      };
    }
  }
};
