import instance from "../axios";

export const listInbound = async () => {
  try {
    const response = await instance.get("/inbound/list");
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.msg || "Lỗi không xác định khi lấy danh sách lô hàng");
    }
  } catch (error) {
    console.error("Error fetching inbounds list:", error);
    throw error;
  }
};
export const addInbound = async (inbound: FormData) => {
  try {
    const response = await instance.post("/inbound/add", inbound, {
      headers: {
        'Content-Type': 'multipart/form-data'
        ,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error adding inbound:", error);
    throw error;
  }
};

export const getAllProduct = async () => {
  try {
    const response = await instance.get("/inbound/getProduct");
    if (response.status === 200) {
      return response.data.productReady; 
    } else {
      throw new Error(response.data.msg || "Lỗi không xác định khi lấy danh sách sản phẩm");
    }
  } catch (error) {
    console.error("Error fetching products list:", error);
    throw error;
  }
};

export const getAllSupplier = async () => {
  try {
    const response = await instance.get("/inbound/getSupplier");
    if (response.status === 200) {
      return response.data.supplierReady; 
    } else {
      throw new Error(response.data.msg || "Lỗi không xác định khi lấy danh sách nhà cung cấp");
    }
  } catch (error) {
    console.error("Error fetching suppliers list:", error);
    throw error;
  }
};

