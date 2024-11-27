import instance from "../../../../axios";
import { Ram, ResponseRam } from "../../../types/ram/editRam";
import { AxiosError } from "axios";

/**
 * Chỉnh sửa thông tin RAM
 * @param ramId ID của RAM
 * @param updates Dữ liệu cần chỉnh sửa
 * @returns Thông tin phản hồi sau khi chỉnh sửa RAM
 */
export const editRam = async (
  ramId: string,
  updates: Partial<Ram>
): Promise<ResponseRam> => {
  try {
    const response = await instance.put(`/admin/attributes/edit-ram/${ramId}`, updates, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        err: error.response?.data.err || 1,
        msg: error.response?.data.msg || "Đã xảy ra lỗi",
        status: error.response?.status || 500,
        error: error.message,
      };
    } else {
      return {
        success: false,
        err: 1,
        msg: "Đã xảy ra lỗi không mong muốn",
        status: 500,
        error: error instanceof Error ? error.message : "Lỗi không xác định",
      };
    }
  }
};