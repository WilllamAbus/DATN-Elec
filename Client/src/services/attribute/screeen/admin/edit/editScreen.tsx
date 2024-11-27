import instance from "../../../../axios";
import { Screen, ResponseScreen } from "../../../types/screen/editScreen";
import { AxiosError } from "axios";

export const editScreen = async (screenId: string, updates: Partial<Screen>): Promise<ResponseScreen> => {
  try {
    const response = await instance.put(`/admin/attributes/edit-screen/${screenId}`, updates, {
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
