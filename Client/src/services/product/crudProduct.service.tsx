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
    return response.data;
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
    // Kiểm tra cấu trúc dữ liệu trả về
    console.log(response.data); // Xem cấu trúc dữ liệu trả về từ API
    return response.data; // Trả về toàn bộ dữ liệu nếu bạn không chắc chắn về cấu trúc
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
