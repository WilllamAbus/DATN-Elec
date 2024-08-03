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

export const searchProduct = async (keyword:string) => {
  try {
    const response = await instance.get(`/product/search/${keyword}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};
export const upViewProduct = async (id: string) => {
  const response = await instance.put(`/product/upView/${id}`, {}, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
export const loadPrice = async (price:string) => {
  try {
    const response = await instance.get(`/product/filter/${price}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};
