import instance from "../axios";

export const addProduct = async (product: FormData) => {
  try {
    const response = await instance.post("/product/add", product, {
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
export const listProduct = async () => {
  try {
    const response = await instance.get("/product/list");

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.msg || "Lỗi không xác định khi lấy danh sách sản phẩm"
      );
    }
  } catch (error) {
    console.error("Error fetching product list:", error);
    throw error;
  }
};



export const hardDeleteProduct = async (id: string) => {
  try {
    const response = await instance.delete(`/product/hard-delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
export const getOneProduct = async (id: string) => {
  try {
    const response = await instance.get(`/product/get-one/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};
export const getListCategories = async () => {
  try {
    const response = await instance.get("/product/listcate");
 
    console.log(response.data); 
    return response.data; 
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
export const updateProduct = async (id: string, productData: FormData) => {
  try {
    const response = await instance.put(`/product/update/${id}`, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const searchProduct = async (keyword: string) => {
  try {
    const response = await instance.get(`/product/search/${keyword}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};
export const upViewProduct = async (id: string) => {
  const response = await instance.put(
    `/product/upView/${id}`,
    {},
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
export const loadPrice = async (price: string) => {
  try {
    const response = await instance.get(`/product/filter/${price}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi:", error);
  }
};
export const softDeleteProduct = async (id: string) => {
  try {
    const response = await instance.patch(`/product/soft-delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error soft deleting product:", error);
    throw error;
  }
};

export const getSoftDeletedProducts = async () => {
  try {
    const response = await instance.get("/product/deleted-list");
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching soft-deleted products:", error);
    throw error;
  }
};
export const restoreProduct = async (id: string) => {
  try {
    const response = await instance.patch(`/product/restore/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error restoring product:", error);
    throw error;
  }
};
export const getProductLimit = async (page = 1) => {
  try {
    const response = await instance.get(`/product/limit`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products with limit:", error);
    throw error;
  }
};
