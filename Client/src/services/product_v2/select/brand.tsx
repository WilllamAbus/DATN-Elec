import instance from "../../axios";
import { Brand, SelectBrandResponse } from "../types/brand";
export const selectBrand = async (): Promise<Brand[]> => {
  try {
    const response = await instance.get<SelectBrandResponse>("/product_v2/selectbrand");
    return response.data.selectbrand;
  } catch (error) {
    console.error("lỗi brands:", error);
    throw error;
  }
};
