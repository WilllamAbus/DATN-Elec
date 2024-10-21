import { UserProfile } from "../../types/user";
import instance from "../axios";
const API_URL = import.meta.env.VITE_API_URL;

// xóa mềm
export const softDeleteUser = async (userId: string) => {
  try {
    const response = await instance.patch(
      `${API_URL}/admin/soft-delete/${userId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
//Khôi Phục
export const restore = async (userId: string) => {
  try {
    const response = await instance.patch(`${API_URL}/admin/restore/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
//danh sách tài khoản xóa mềm

export const listDeleted = async () => {
  const response = await instance.get(`${API_URL}/admin/deleted`);

  return response.data;
};

//list active tk
export const listActive = async () => {
  const response = await instance.get(`${API_URL}/admin/list`);

  return response.data;
};
//list Role
export const listRole = async () => {
  const response = await instance.get(`${API_URL}/admin/listRole`);

  return response.data;
};
// cập nhật thông tin người dùng
export const updateUser = async (
  userId: string,
  formData: FormData
): Promise<UserProfile> => {
  try {
    const response = await instance.put(
      `${API_URL}/admin/edit/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getUserById = async (userId: string) => {
  try {
    const response = await instance.get(`${API_URL}/admin/get-one/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
