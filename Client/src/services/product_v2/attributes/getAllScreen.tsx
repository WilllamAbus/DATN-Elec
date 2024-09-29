import instance from "../../axios";
import { 
  GetAllScreenResponse, 
  STATUS_OK, 
  STATUS_NOT_FOUND, 
  STATUS_INTERNAL_ERROR, 
  createErrorResponse 
} from "../types/attributes/getAllScreen";

export const getAllScreen = async (): Promise<GetAllScreenResponse> => {
  try {
    const response = await instance.get<GetAllScreenResponse>("/attributes/get-all-screen");

    if (response.status !== STATUS_OK) {
      return createErrorResponse("Lỗi không xác định", response.status);
    }
    if (response.data.total === 0) {
      return createErrorResponse("Không tìm thấy màn hình nào", STATUS_NOT_FOUND);
    }
    return response.data as GetAllScreenResponse; 
  } catch (error) {
    const errorMessage = (error as Error).message || "Lỗi không xác định"; 
    return createErrorResponse(errorMessage, STATUS_INTERNAL_ERROR);
  }
};
