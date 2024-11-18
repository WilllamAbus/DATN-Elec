import instance from "../axios";

export const listSuppliers = async (page = 1, limit = 5) => {
  try {
    const response = await instance.get(`/suppliers/list?page=${page}&limit=${limit}`);


    // console.log("API response data:", response.data); // Xem xét cấu trúc của dữ liệu
    return {
      data: response.data.data,  // Phản hồi chứa danh sách nhà cung cấp
      totalPages: response.data.totalPages,  // Tổng số trang
    };
  } catch (error) {
    console.error("Error fetching suppliers list:", error);
    throw error;
  }
};

export const addSuppliers = async (supplier :FormData) =>{
  try{
    const response = await instance.post("/suppliers/add", supplier, {
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
}
export const getOneSupplier = async (id: string) => {
  try {
    const response = await instance.get(`/suppliers/get-one/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};

export const updateSupplier = async (id: string, supplierData: FormData) => {
  try {
    const response = await instance.put(`/suppliers/update/${id}`, supplierData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message); // Trả về lỗi từ API
    }
    throw new Error("Không thể kết nối tới server, vui lòng thử lại sau.");
  }
};

export const hardDeleteSupplier = async (id: string) => {
  try {
    const response = await instance.delete(`/suppliers/hard-delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting suppliers:", error);
    throw error;
  }
};

export const softDeleteSupplier = async (id: string) => {
  try {
    const response = await instance.patch(`/suppliers/soft-delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error soft deleting suppliers:", error);
    throw error;
  }
};

export const getSoftDeletedSuppliers = async (page = 1, limit = 5) => {
  try {
    const response = await instance.get(`/suppliers/deleted-list?page=${page}&limit=${limit}`);
    if (response.data.success) {
      return {
        data: response.data.data,
        totalPages: response.data.totalPages,
      };
    } else {
      throw new Error(response.data.msg || "Lỗi không xác định khi lấy danh sách nhà cung cấp");
    }
  } catch (error) {
    console.error("Error fetching soft-deleted suppliers:", error);
    throw error;
  }
};
export const restoreSupplier = async (id: string) => {
  try {
    const response = await instance.patch(`/suppliers/restore/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error restoring suppliers:", error);
    throw error;
  }
};

export const searchSuppliers = async (keyword: string, page = 1, limit = 5) => {
  try {
    if (!keyword || keyword.trim() === "") {
      throw new Error("Từ khóa tìm kiếm không hợp lệ");
    }
    const response = await instance.get(`/suppliers/search`, {
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

export const searchDeleteSuppliers = async (keyword: string, page = 1, limit = 5) => {
  try {
    if (!keyword || keyword.trim() === "") {
      throw new Error("Từ khóa tìm kiếm không hợp lệ");
    }
    const response = await instance.get(`/suppliers/searchDelete`, {
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
