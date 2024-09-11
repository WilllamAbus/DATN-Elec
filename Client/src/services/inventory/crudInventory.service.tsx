import instance from "../axios";

export const listInventory = async (page = 1, limit = 5) => {
  try {
    const response = await instance.get(`/inventory/list?page=${page}&limit=${limit}`);
    if (response.data.success) {
      return {
        data: response.data.data,
        totalPages: response.data.totalPages,
      };
    } else {
      throw new Error(response.data.msg || "Lỗi không xác định khi lấy danh sách kho hàng");
    }
  } catch (error) {
    console.error("Error fetching inbounds list:", error);
    throw error;
  }
};

export const updateQuantityShelf = async (inventory :any) => {
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

export const getListProducts = async () => {
  try {
    const response = await instance.get("/inventory/getProducts");
    // Kiểm tra cấu trúc dữ liệu trả về
    // console.log(response.data); // Xem cấu trúc dữ liệu trả về từ API
    return response.data; // Trả về toàn bộ dữ liệu nếu bạn không chắc chắn về cấu trúc
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// export const getListSuppliers = async () => {
//   try {
//     const response = await instance.get("/inventory/getSuppliers");
//     // Kiểm tra cấu trúc dữ liệu trả về
//     // console.log(response.data); // Xem cấu trúc dữ liệu trả về từ API
//     return response.data; // Trả về toàn bộ dữ liệu nếu bạn không chắc chắn về cấu trúc
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     throw error;
//   }
// };

// export const getOneInventory = async (id: string) => {
//   try {
//     const response = await instance.get(`/inventory/get-one/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching inventory:", error);
//     throw error;
//   }
// };
