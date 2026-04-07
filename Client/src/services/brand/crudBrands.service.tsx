import instance from "../axios";

export const listBrands = async (page = 1, limit = 5) => {
  try {
    
    const response = await instance.get(`/brands/list?page=${page}&limit=${limit}`);
    return {
      data: response.data.data,  // Phản hồi chứa danh sách nhà cung cấp
      totalPages: response.data.totalPages,  // Tổng số trang
    };
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
  }catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message); // Trả về lỗi từ API
    }
    throw new Error("Không thể kết nối tới server, vui lòng thử lại sau.");
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
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message); // Trả về lỗi từ API
    }
    throw new Error("Không thể kết nối tới server, vui lòng thử lại sau.");
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
    return {
      data: response.data.data,  // Phản hồi chứa danh sách nhà cung cấp
      totalPages: response.data.totalPages,  // Tổng số trang
    };
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

export const searchBrands = async (keyword: string, page = 1, limit = 5) => {
  try {
    if (!keyword || keyword.trim() === "") {
      throw new Error("Từ khóa tìm kiếm không hợp lệ");
    }
    const response = await instance.get(`/brands/search`, {
      params: {
        keyword: keyword, 
        page : page,
        limit : limit
      }
    });

    // console.log("API response data:", response.data); // Xem xét cấu trúc của dữ liệu
    return {
      data: response.data.data,  // Phản hồi chứa danh sách nhà cung cấp
      totalPages: response.data.totalPages,  // Tổng số trang
    };
  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      console.error("Error message:", (error as Error).message);
    } else {
      console.error("Unknown error occurred", error);
    }
  }
};
export const searchDeleteBrands = async (keyword: string, page = 1, limit = 5) => {
  try {
    if (!keyword || keyword.trim() === "") {
      throw new Error("Từ khóa tìm kiếm không hợp lệ");
    }
    const response = await instance.get(`/brands/searchDelete`, {
      params: {
        keyword: keyword, 
        page : page,
        limit : limit
      }
    });

    // console.log("API response data:", response.data); // Xem xét cấu trúc của dữ liệu
    return {
      data: response.data.data,  // Phản hồi chứa danh sách nhà cung cấp
      totalPages: response.data.totalPages,  // Tổng số trang
    };
  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      console.error("Error message:", (error as Error).message);
    } else {
      console.error("Unknown error occurred", error);
    }
  }
};