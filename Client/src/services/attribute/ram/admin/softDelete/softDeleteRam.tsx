import instance from "../../../../axios";
import { SoftDeleteRamResponse } from "../../../types/ram/softDeleteRam";

/**
 * Xóa mềm RAM theo ID
 * @param ramId ID của RAM
 * @returns Thông tin phản hồi sau khi xóa mềm RAM
 */
export const softDeleteRam = async (
  ramId: string
): Promise<SoftDeleteRamResponse> => {
  try {
    if (!ramId) {
      throw new Error("ID RAM là bắt buộc");
    }

    const response = await instance.patch<SoftDeleteRamResponse>(
      `/admin/attributes/soft-delete-ram/${ramId}`
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi xóa RAM mềm:", error);
    throw new Error("Không thể xóa RAM mềm");
  }
};
