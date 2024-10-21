
import instance from "../axios";
import { GetAllStorageBySlugUrlResponse } from "./types/getAllStorageBySlugUrl";

export const getAllStorageBySlugUrl = async (slug: string): Promise<GetAllStorageBySlugUrlResponse> => {
  try {
    const response = await instance.get<GetAllStorageBySlugUrlResponse>(`/client/product-detail/storage-by-slug/${slug}`);

    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin storage:', error);
    return {
      success: false,
      err: -1,
      msg: 'Lỗi khi lấy thông tin storage',
      status: 500,
      data: [],
    };
  }
};
