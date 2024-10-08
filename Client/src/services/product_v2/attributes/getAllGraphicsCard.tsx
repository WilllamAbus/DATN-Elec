import instance from "../../axios";
import { 
  GetAllGraphicsCardResponse, 
  STATUS_OK, 
  STATUS_NOT_FOUND, 
  STATUS_INTERNAL_ERROR, 
  createErrorResponse 
} from "../types/attributes/getAllGraphicsCard";

export const getAllGraphicsCard = async (): Promise<GetAllGraphicsCardResponse> => {
  try {
    const response = await instance.get<GetAllGraphicsCardResponse>("/attributes/get-all-graphics-card");

    if (response.status !== STATUS_OK) {
      return createErrorResponse("Lỗi không xác định", response.status);
    }
    if (response.data.total === 0) {
      return createErrorResponse("Không tìm thấy card đồ họa nào", STATUS_NOT_FOUND);
    }
    return response.data as GetAllGraphicsCardResponse; 
  } catch (error) {
    const errorMessage = (error as Error).message || "Lỗi không xác định"; 
    return createErrorResponse(errorMessage, STATUS_INTERNAL_ERROR);
  }
};
