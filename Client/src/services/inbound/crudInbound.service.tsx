import instance from "../axios";

export const listInbound = async (page = 1, limit = 5) => {
  try {
    const response = await instance.get(`/inbound/list?page=${page}&limit=${limit}`);
    if (response.data.success) {
      return {
        data: response.data.data,
        totalPages: response.data.totalPages,
      };
    } else {
      throw new Error(response.data.msg || "Lỗi không xác định khi lấy danh sách lô hàng");
    }
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
    return response.data;
  } catch (error) {
    console.error("Error fetching inbounds:", error);
    throw error;
  }
};
