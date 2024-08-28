import instance from "../../axios";
import { HomeAllProductResponse } from "./types/homeAllProduct";
export const homeAllProduct = async (): Promise<HomeAllProductResponse> => {
  try {
    const response = await instance.get<HomeAllProductResponse>("/client/product/homeAllProduct");
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      err: 1,
      msg: "lõi",
      status: 500,
      products: [],
      error: error.message,
    };
  }
};
