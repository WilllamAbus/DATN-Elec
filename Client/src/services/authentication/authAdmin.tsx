import instance from "../axios";
const API_URL = import.meta.env.VITE_API_URL;

// xóa mềm
export const softDeleteUser = async (userId: string) => {
  try {
    const response = await instance.patch(
      `${API_URL}/admin/soft-delete/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data; // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    throw new Error((error as Error).message); // Ném lỗi để xử lý ở nơi khác
  }
};

//Khôi Phục
export const restore = async (userId: string) => {
  try {
    const response = await instance.patch(
      `${API_URL}/admin/restore/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data; // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    throw new Error((error as Error).message); // Ném lỗi để xử lý ở nơi khác
  }
};
//danh sách tài khoản xóa mềm
// http://localhost:4000/api/admin/deleted
export const listDeleted = async () => {
  const response = await instance.get(`${API_URL}/admin/deleted`);

  return response.data;
};
// http://localhost:4000/api/admin/list
//list active tk
export const listActive = async () => {
  const response = await instance.get(`${API_URL}/admin/list`);

  return response.data;
};
// cập nhật thông tin người dùng
export const updateUser = async (userId: string, userData: any) => {
  try {
    const response = await instance.put(`${API_URL}/edit/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data; // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    throw new Error((error as Error).message); // Ném lỗi để xử lý ở nơi khác
  }
};
