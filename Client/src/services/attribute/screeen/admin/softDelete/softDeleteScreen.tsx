import instance from "../../../../axios";
import { SoftDeleteScreenResponse } from "../../../types/screen/softDeleteScreen";

/**
 * @param screenId 
 * @returns 
 */
export const softDeleteScreen = async (
  screenId: string
): Promise<SoftDeleteScreenResponse> => {
  try {
    if (!screenId) {
      throw new Error("ID màn hình là bắt buộc");
    }

    const response = await instance.patch<SoftDeleteScreenResponse>(
      `/admin/attributes/soft-delete/${screenId}`
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi xóa màn hình mềm:", error);
    throw new Error("Không thể xóa màn hình mềm");
  }
};
