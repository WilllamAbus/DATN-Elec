import instance from "../axios";

export const listBrands = async (page = 1, limit = 5) => {
  try {
    
    const response = await instance.get(`/brands/list?page=${page}&limit=${limit}`);
    if (response.data.success) {
      return {
        data: response.data.data,
        totalPages: response.data.totalPages,
      };
    }else {
      throw new Error(response.data.msg || "Lỗi không xác định khi lấy danh sách thương hiệu");
    }
  } catch (error) {
    console.error("Error fetching brand list:", error);
    throw error;
  }
};

export const addBrands = async (brand :FormData) =>{
  try{
    const response = await instance.post("/brands/add", brand, {
      headers: {
        'Content-Type': 'multipart/form-data'
      ,}
    });
    return response.data;
  }catch(error){
    console.error("Error adding brand:", error);
    throw error;
  }
};

export const getListCategories = async () => {
  try {
    const response = await instance.get("/brands/listcate");
    // Kiểm tra cấu trúc dữ liệu trả về
    console.log(response.data); // Xem cấu trúc dữ liệu trả về từ API
    return response.data; // Trả về toàn bộ dữ liệu nếu bạn không chắc chắn về cấu trúc
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getListSuppliers = async () => {
  try {
    const response = await instance.get("/brands/listsupplier");
    // Kiểm tra cấu trúc dữ liệu trả về
    console.log(response.data); // Xem cấu trúc dữ liệu trả về từ API
    return response.data; // Trả về toàn bộ dữ liệu nếu bạn không chắc chắn về cấu trúc
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};


export const getOneBrand = async (id: string) => {
  try {
    const response = await instance.get(`/brands/get-one/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export const updateBrand = async (id: string, brandData: FormData) => {
  try {
    const response = await instance.put(`/brands/update/${id}`, brandData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating brands:", error);
    throw error;
  }
};

export const hardDeleteBrand = async (id: string) => {
  try {
    const response = await instance.delete(`/brands/hard-delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting brands:", error);
    throw error;
  }
};

export const softDeleteBrand = async (id: string) => {
  try {
    const response = await instance.patch(`/brands/soft-delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error soft deleting brands:", error);
    throw error;
  }
};

export const getSoftDeletedBrands = async (page = 1, limit = 5) => {
  try {
    const response = await instance.get(`/brands/deleted-list?page=${page}&limit=${limit}`);
    if (response.data.success) {
      return {
        data: response.data.data,
        totalPages: response.data.totalPages,
      };
    }else {
      throw new Error(response.data.msg || "Lỗi không xác định khi lấy danh sách thương hiệu");
    }
  } catch (error) {
    console.error("Error fetching soft-deleted brands:", error);
    throw error;
  }
};
export const restoreBrand = async (id: string) => {
  try {
    const response = await instance.patch(`/brands/restore/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error restoring brands:", error);
    throw error;
  }
};