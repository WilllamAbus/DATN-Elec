import instance from "../../../../axios"; 
import { AxiosError } from "axios";
import { Ram, ResponseRam } from '../../../types/ram/addRam';

export const addRam = async (ram: Ram): Promise<ResponseRam> => {
  try {
    const response = await instance.post("/admin/attributes/add-ram", ram, {
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
