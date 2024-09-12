import instance from "../../axios";
import { GetOneResponse } from "./types";

export const getOneProduct = async (id: string): Promise<GetOneResponse> => {
  try {
    const response = await instance.get<GetOneResponse>(`/admin/product/getone/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return {
      success: false,
      err: 1,
      msg: "Lỗi",
      status: 500,
      product: undefined,
    };
  }
};
