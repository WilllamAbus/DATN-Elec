import instance from "../axios";

export const listInventory = async (page = 1, limit = 5) => {
  try {
    const response = await instance.get(`/inventory/list?page=${page}&limit=${limit}`);
    return {
      data: response.data.data,  // Phản hồi chứa danh sách nhà cung cấp
      totalPages: response.data.totalPages,  // Tổng số trang
    };
  } catch (error) {
    console.error("Error fetching inbounds list:", error);
    throw error;
  }
};

export const listInventoryV2 = async (page = 1, limit = 5) => {
  try {
    const response = await instance.get(`/inventory/listV2?page=${page}&limit=${limit}`);
    console.log("hahah",response.data);
    return {
      data: response.data.data,  // Phản hồi chứa danh sách nhà cung cấp
      totalPages: response.data.totalPages,  // Tổng số trang
    };
  } catch (error) {
    console.error("Error fetching inbounds list:", error);
    throw error;
  }
};

export const updateQuantityShelf = async (inventory: any) => {
  try {
    const response = await instance.post("/inventory/update-quantity-shelf", inventory, {
      headers: {
        'Content-Type': 'application/json'
        ,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error adding inventory:", error);
    throw error;
  }
};

export const updateQuantityShelfV2 = async (inventory: any) => {
  try {
    const response = await instance.post("/inventory/update-quantity-shelf-V2", inventory, {
      headers: {
        'Content-Type': 'application/json'
        ,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error adding inventory:", error);
    throw error;
  }
};

export const getListProducts = async () => {
  try {
    const response = await instance.get("/inventory/getProducts");
    return response.data; // Trả về toàn bộ dữ liệu nếu bạn không chắc chắn về cấu trúc
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getListProductsV2 = async () => {
  try {
    const response = await instance.get("/inventory/getProductV2");
    console.log("hihihi",response.data);
    return response.data; // Trả về toàn bộ dữ liệu nếu bạn không chắc chắn về cấu trúc
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const searchInventory = async (keyword: string, page = 1, limit = 5) => {
  try {
    if (!keyword || keyword.trim() === "") {
      throw new Error("Từ khóa tìm kiếm không hợp lệ");
    }
    const response = await instance.get(`/inventory/search`, {
      params: {
        keyword: keyword,
        page: page,
        limit: limit
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

export const searchInventoryV2 = async (keyword: string, page = 1, limit = 5) => {
  try {
    if (!keyword || keyword.trim() === "") {
      throw new Error("Từ khóa tìm kiếm không hợp lệ");
    }
    const response = await instance.get(`/inventory/searchV2`, {
      params: {
        keyword: keyword,
        page: page,
        limit: limit
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

export const getOneInventoryItem = async (productId: string) => {
  try {
    // Gọi API get-one với productId
    const response = await instance.get(`/inventory/get-one/${productId}`);
    
    // Kiểm tra phản hồi từ API
    if (response.data.success && response.data.data) {
      return response.data.data; // Trả về dữ liệu inventory
    } else {
      throw new Error(response.data.message || "Sản phẩm không tồn tại.");
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    throw new Error("Không thể lấy thông tin sản phẩm từ API.");
  }
};

export const getOneInventoryItemV2 = async (productId: string) => {
  try {
    // Gọi API get-one với productId
    const response = await instance.get(`/inventory/get-oneV2/${productId}`);
    
    // Kiểm tra phản hồi từ API
    if (response.data.success && response.data.data) {
      return response.data.data; // Trả về dữ liệu inventory
    } else {
      throw new Error(response.data.message || "Sản phẩm không tồn tại.");
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    throw new Error("Không thể lấy thông tin sản phẩm từ API.");
  }
};
