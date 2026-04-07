import instance from "../axios";

export const listInbound = async (page = 1, limit = 5) => {
  try {
    const response = await instance.get(`/inbound/list?page=${page}&limit=${limit}`);
    console.log("hahahah",response.data);
    return {
      data: response.data.data,  // Phản hồi chứa danh sách nhà cung cấp
      totalPages: response.data.totalPages,  // Tổng số trang
    };
  } catch (error) {
    console.error("Error fetching inbounds list:", error);
    throw error;
  }
};

export const listInboundV2 = async (page = 1, limit = 5) => {
  try {
    const response = await instance.get(`/inbound/listV2?page=${page}&limit=${limit}`);
    console.log("hahahah",response.data);
    return {
      data: response.data.data, 
      totalPages: response.data.totalPages,  // Tổng số trang
    };
  } catch (error) {
    console.error("Error fetching inbounds list:", error);
    throw error;
  }
};
export const addInbound = async (inbound: any) => {
  try {
    const response = await instance.post("/inbound/add", inbound, {
      headers: {
        'Content-Type': 'application/json'
        ,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error adding inbound:", error);
    throw error;
  }
};

export const addInboundV2 = async (inbound: any) => {
  try {
    const response = await instance.post("/inbound/addProductV2", inbound, {
      headers: {
        'Content-Type': 'application/json'
        ,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error adding inbound:", error);
    throw error;
  }
};
export const updateInbound = async (id: string, inbound: any) => {
  try {
    const response = await instance.put(`/inbound/update/${id}`, inbound, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating inbounds:", error);
    throw error;
  }
};


export const updateInboundV2 = async (id: string, inbound: any) => {
  try {
    const response = await instance.put(`/inbound/updateV2/${id}`, inbound, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating inbounds:", error);
    throw error;
  }
};
export const getListProducts = async () => {
  try {
    const response = await instance.get("/inbound/listProduct");
    // Kiểm tra cấu trúc dữ liệu trả về
    console.log(response.data); // Xem cấu trúc dữ liệu trả về từ API
    return response.data; // Trả về toàn bộ dữ liệu nếu bạn không chắc chắn về cấu trúc
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getListProductV2 = async () => {
  try {
    const response = await instance.get("/inbound/listProductV2");
    // Kiểm tra cấu trúc dữ liệu trả về
    console.log(response.data); // Xem cấu trúc dữ liệu trả về từ API
    return response.data; // Trả về toàn bộ dữ liệu nếu bạn không chắc chắn về cấu trúc
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getListSuppliers = async () => {
  try {
    const response = await instance.get("/inbound/listSupplier");
    // Kiểm tra cấu trúc dữ liệu trả về
    console.log(response.data); // Xem cấu trúc dữ liệu trả về từ API
    return response.data; // Trả về toàn bộ dữ liệu nếu bạn không chắc chắn về cấu trúc
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};

export const getOneInbound = async (id: string) => {
  try {
    const response = await instance.get(`/inbound/get-one/${id}`);
    console.log("hahaha", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching inbounds:", error);
    throw error;
  }
};

export const getOneInboundV2 = async (id: string) => {
  try {
    const response = await instance.get(`/inbound/get-oneV2/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching inbounds:", error);
    throw error;
  }
};

export const searchInbound = async (keyword: string, page = 1, limit = 5) => {
  try {
    if (!keyword || keyword.trim() === "") {
      throw new Error("Từ khóa tìm kiếm không hợp lệ");
    }
    const response = await instance.get(`/inbound/search`, {
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

export const searchInboundV2 = async (keyword: string, page = 1, limit = 5) => {
  try {
    if (!keyword || keyword.trim() === "") {
      throw new Error("Từ khóa tìm kiếm không hợp lệ");
    }
    const response = await instance.get(`/inbound/searchV2`, {
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
export const hardDeleteInbound = async (id: string) => {
  try {
    const response = await instance.delete(`/inbound/hard-delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting inbounds:", error);
    throw error;
  }
};

export const softDeleteInbound = async (id: string) => {
  try {
    const response = await instance.patch(`/inbound/soft-delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error soft deleting inbounds:", error);
    throw error;
  }
};

export const getSoftDeletedInbounds = async (page = 1, limit = 5) => {
  try {
    const response = await instance.get(`/inbound/deleted-list?page=${page}&limit=${limit}`);
    return {
      data: response.data.data,  // Phản hồi chứa danh sách nhà cung cấp
      totalPages: response.data.totalPages,  // Tổng số trang
    };
  } catch (error) {
    console.error("Error fetching soft-deleted inbounds:", error);
    throw error;
  }
};
export const restoreInbound = async (id: string) => {
  try {
    const response = await instance.patch(`/inbound/restore/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error restoring inbounds:", error);
    throw error;
  }
};

export const searchDeleteInbounds = async (keyword: string, page = 1, limit = 5) => {
  try {
    if (!keyword || keyword.trim() === "") {
      throw new Error("Từ khóa tìm kiếm không hợp lệ");
    }
    const response = await instance.get(`/inbound/searchDelete`, {
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
