import instance from "../../axios";
import { Supplier, SelectSupplierResponse } from "../types/supplier";
export const selectSupplier = async (): Promise<Supplier[]> => {
  try {
    const response = await instance.get<SelectSupplierResponse>("/product_v2/selectsupplier");
    console.log(response);
    return response.data.suppliers;
  } catch (error) {
    console.error("lỗi supplier:", error);
    throw error;
  }
};
