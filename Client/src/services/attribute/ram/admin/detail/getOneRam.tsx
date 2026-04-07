import instance from "../../../../axios";
import { GetOneRamResponse } from "../../../types/ram/getOneRam";

export const getOneRam = async (ramId: string): Promise<GetOneRamResponse> => {
  try {
    const response = await instance.get<GetOneRamResponse>(`/admin/attributes/get-one-ram/${ramId}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      err: 1,
      msg: "Có lỗi xảy ra khi lấy thông tin RAM",
      status: 500,
      ram: undefined,
    };
  }
};
