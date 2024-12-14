import instance from "../../axios";
import { LimitCrudOrderResponse } from "../../../types/order/order";

export const pagiCrudOrder = async (
  page: number,
  search?: string,
  stateOrder?: string
): Promise<LimitCrudOrderResponse> => {
  try {
    const queryParams = new URLSearchParams({ page: page.toString() });

    if (search) {
      queryParams.append("search", search);
    }

    if (stateOrder) {
      queryParams.append("stateOrder", stateOrder);
    }

    const response = await instance.get<LimitCrudOrderResponse>(
      `/admin/order/limit/?${queryParams.toString()}`
    );
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Order:", error);
    throw new Error("Failed to fetch Order");
  }
};
