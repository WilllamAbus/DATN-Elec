import instance from "../../../axios";
import { PostResponse } from "../types/softDeletePost";

export const softDeletePost = async (id: string): Promise<PostResponse> => {
  try {
    const response = await instance.patch(`/admin/post/soft-delete-post/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      err: 1,
      msg: error.response?.data?.msg || "Lỗi khi xóa bài đăng",
      status: error.response?.status || 500,
      data: undefined,
    };
  }
};
