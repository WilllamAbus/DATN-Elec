import instance from "../../../axios";
import { SoftDeleteResponse} from "../types/CategoryPost";
export const softDeleteCategoryPost = async (id: string): Promise<SoftDeleteResponse> => {
  try {
    const response = await instance.patch(`/admin/post/softDelete/${id}`);
    return response.data; 
  } catch (error: any) {
    return {
      success: false,
      err: 1,
      msg: error.response?.data?.msg || "Lỗi khi xóa bài đăng",
      status: error.response?.status || 500, 
      data: undefined 
    };
  }
};
